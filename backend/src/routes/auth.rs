use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use axum::{extract::State, routing::post, Json, Router};
use axum_extra::extract::cookie::{Cookie, CookieJar};
use chrono::{Duration, Utc};
use rand::Rng;
use serde_json::json;
use sqlx::Row;

use crate::errors::AppError;
use crate::middleware::auth::{require_auth, SESSION_COOKIE};
use crate::models::user::{
    LoginRequest, RegisterRequest, RegisterWithCodeRequest, SendRegisterCodeRequest, User,
    UserPublic,
};
use crate::state::AppState;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/auth/send-register-code", post(send_register_code))
        .route("/auth/register-with-code", post(register_with_code))
        .route("/auth/register", post(register))
        .route("/auth/login", post(login))
        .route("/auth/logout", post(logout))
        .route(
            "/auth/me",
            axum::routing::get(me).route_layer(axum::middleware::from_fn(require_auth)),
        )
}

async fn send_verification_email(
    state: &AppState,
    email: &str,
    code: &str,
) -> Result<(), AppError> {
    if state.mock_email {
        tracing::info!("[mock-email] register code for {} => {}", email, code);
        return Ok(());
    }

    if state.resend_api_key.is_empty() {
        return Err(AppError::Internal(
            "RESEND_API_KEY is not configured".into(),
        ));
    }

    let body = json!({
        "from": state.resend_from_email,
        "to": [email],
        "subject": "Your JsonViz verification code",
        "text": format!("Your JsonViz verification code is {}. It expires in 10 minutes.", code),
        "html": format!("<p>Your JsonViz verification code is <strong style=\"font-size:20px\">{}</strong>.</p><p>It expires in 10 minutes.</p>", code)
    });

    let response = state
        .http_client
        .post("https://api.resend.com/emails")
        .bearer_auth(&state.resend_api_key)
        .json(&body)
        .send()
        .await
        .map_err(|e| AppError::Internal(format!("Resend request failed: {e}")))?;

    if !response.status().is_success() {
        let text = response.text().await.unwrap_or_default();
        return Err(AppError::Internal(format!("Resend rejected email: {text}")));
    }

    Ok(())
}

fn generate_six_digit_code() -> String {
    let mut rng = rand::thread_rng();
    format!("{:06}", rng.gen_range(0..1_000_000))
}

/// POST /auth/send-register-code
async fn send_register_code(
    State(state): State<AppState>,
    Json(payload): Json<SendRegisterCodeRequest>,
) -> Result<Json<serde_json::Value>, AppError> {
    let email = payload.email.trim().to_lowercase();
    if email.is_empty() || !email.contains('@') {
        return Err(AppError::BadRequest("Valid email is required".into()));
    }

    let exists: bool = sqlx::query("SELECT EXISTS(SELECT 1 FROM users WHERE email = $1) AS ok")
        .bind(&email)
        .fetch_one(&state.pool)
        .await?
        .get("ok");
    if exists {
        return Err(AppError::Conflict("Email already registered".into()));
    }

    let recent_exists: bool = sqlx::query(
        "SELECT EXISTS(SELECT 1 FROM email_verification_codes WHERE email = $1 AND purpose = 'register' AND created_at > now() - interval '60 seconds') AS ok",
    )
    .bind(&email)
    .fetch_one(&state.pool)
    .await?
    .get("ok");
    if recent_exists {
        return Err(AppError::BadRequest(
            "Please wait 60 seconds before requesting a new code".into(),
        ));
    }

    let code = generate_six_digit_code();
    let expires_at = Utc::now() + Duration::minutes(10);

    sqlx::query(
        "INSERT INTO email_verification_codes (email, code, purpose, expires_at) VALUES ($1, $2, 'register', $3)",
    )
    .bind(&email)
    .bind(&code)
    .bind(expires_at)
    .execute(&state.pool)
    .await?;

    send_verification_email(&state, &email, &code).await?;

    Ok(Json(json!({ "sent": true })))
}

/// POST /auth/register-with-code
async fn register_with_code(
    State(state): State<AppState>,
    jar: CookieJar,
    Json(payload): Json<RegisterWithCodeRequest>,
) -> Result<(CookieJar, Json<UserPublic>), AppError> {
    let email = payload.email.trim().to_lowercase();
    let code = payload.code.trim();

    if email.is_empty() || !email.contains('@') {
        return Err(AppError::BadRequest("Valid email is required".into()));
    }
    if payload.password.len() < 8 {
        return Err(AppError::BadRequest(
            "Password must be at least 8 characters".into(),
        ));
    }
    if code.len() != 6 || !code.chars().all(|ch| ch.is_ascii_digit()) {
        return Err(AppError::BadRequest(
            "Verification code must be 6 digits".into(),
        ));
    }

    let exists: bool = sqlx::query("SELECT EXISTS(SELECT 1 FROM users WHERE email = $1) AS ok")
        .bind(&email)
        .fetch_one(&state.pool)
        .await?
        .get("ok");
    if exists {
        return Err(AppError::Conflict("Email already registered".into()));
    }

    let verify_row = sqlx::query(
        "SELECT id FROM email_verification_codes WHERE email = $1 AND code = $2 AND purpose = 'register' AND consumed_at IS NULL AND expires_at > now() ORDER BY created_at DESC LIMIT 1",
    )
    .bind(&email)
    .bind(code)
    .fetch_optional(&state.pool)
    .await?
    .ok_or_else(|| AppError::BadRequest("Invalid or expired verification code".into()))?;

    let verification_id: uuid::Uuid = verify_row.get("id");

    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    let password_hash = argon2
        .hash_password(payload.password.as_bytes(), &salt)
        .map_err(|e| AppError::Internal(format!("Password hash error: {e}")))?
        .to_string();

    let row = sqlx::query(
        "INSERT INTO users (email, password_hash, email_verified_at) VALUES ($1, $2, now()) RETURNING id, email, password_hash, plan, email_verified_at, created_at, updated_at",
    )
    .bind(&email)
    .bind(&password_hash)
    .fetch_one(&state.pool)
    .await?;

    sqlx::query("UPDATE email_verification_codes SET consumed_at = now() WHERE id = $1")
        .bind(verification_id)
        .execute(&state.pool)
        .await?;

    let user = User {
        id: row.get("id"),
        email: row.get("email"),
        password_hash: row.get("password_hash"),
        plan: row.get("plan"),
        email_verified_at: row.get("email_verified_at"),
        created_at: row.get("created_at"),
        updated_at: row.get("updated_at"),
    };

    let cookie = Cookie::build((SESSION_COOKIE, user.id.to_string()))
        .path("/")
        .http_only(true)
        .same_site(axum_extra::extract::cookie::SameSite::Lax)
        .max_age(time::Duration::days(30))
        .build();

    Ok((jar.add(cookie), Json(user.into())))
}

/// POST /auth/register
async fn register(
    State(_state): State<AppState>,
    Json(_payload): Json<RegisterRequest>,
) -> Result<Json<UserPublic>, AppError> {
    Err(AppError::BadRequest(
        "Use /auth/send-register-code and /auth/register-with-code to register".into(),
    ))
}

/// POST /auth/login
async fn login(
    State(state): State<AppState>,
    jar: CookieJar,
    Json(payload): Json<LoginRequest>,
) -> Result<(CookieJar, Json<UserPublic>), AppError> {
    let row = sqlx::query(
        "SELECT id, email, password_hash, plan, email_verified_at, created_at, updated_at FROM users WHERE email = $1",
    )
    .bind(&payload.email)
    .fetch_optional(&state.pool)
    .await?
    .ok_or_else(|| AppError::Unauthorized("Invalid email or password".into()))?;

    let verified_at: Option<chrono::DateTime<chrono::Utc>> = row.get("email_verified_at");
    if verified_at.is_none() {
        return Err(AppError::Unauthorized("Email is not verified".into()));
    }

    let password_hash: String = row.get("password_hash");
    let parsed_hash = PasswordHash::new(&password_hash)
        .map_err(|e| AppError::Internal(format!("Hash parse error: {e}")))?;
    Argon2::default()
        .verify_password(payload.password.as_bytes(), &parsed_hash)
        .map_err(|_| AppError::Unauthorized("Invalid email or password".into()))?;

    let user_id: uuid::Uuid = row.get("id");

    let cookie = Cookie::build((SESSION_COOKIE, user_id.to_string()))
        .path("/")
        .http_only(true)
        .same_site(axum_extra::extract::cookie::SameSite::Lax)
        .max_age(time::Duration::days(30))
        .build();

    let user = User {
        id: user_id,
        email: row.get("email"),
        password_hash,
        plan: row.get("plan"),
        email_verified_at: verified_at,
        created_at: row.get("created_at"),
        updated_at: row.get("updated_at"),
    };

    tracing::info!("User logged in: {}", user.email);
    Ok((jar.add(cookie), Json(user.into())))
}

/// POST /auth/logout
async fn logout(jar: CookieJar) -> CookieJar {
    // Build a removal cookie with the same attributes as the login cookie,
    // otherwise the browser may not match and delete it in cross-origin setups.
    jar.remove(
        Cookie::build((SESSION_COOKIE, ""))
            .path("/")
            .secure(true)
            .http_only(true)
            .same_site(axum_extra::extract::cookie::SameSite::Lax)
            .build(),
    )
}

/// GET /auth/me
async fn me(State(state): State<AppState>, jar: CookieJar) -> Result<Json<UserPublic>, AppError> {
    let user_id = jar
        .get(SESSION_COOKIE)
        .and_then(|c| uuid::Uuid::parse_str(c.value()).ok())
        .ok_or_else(|| AppError::Unauthorized("Not logged in".into()))?;

    let row = sqlx::query(
        "SELECT id, email, password_hash, plan, email_verified_at, created_at, updated_at FROM users WHERE id = $1",
    )
    .bind(user_id)
    .fetch_optional(&state.pool)
    .await?
    .ok_or_else(|| AppError::NotFound("User not found".into()))?;

    let user = User {
        id: row.get("id"),
        email: row.get("email"),
        password_hash: row.get("password_hash"),
        plan: row.get("plan"),
        email_verified_at: row.get("email_verified_at"),
        created_at: row.get("created_at"),
        updated_at: row.get("updated_at"),
    };

    Ok(Json(user.into()))
}
