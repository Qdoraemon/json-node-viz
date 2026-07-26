use axum::{extract::State, routing::post, Json, Router};
use hmac::{Hmac, Mac};
use sha2::Sha256;
use sqlx::Row;

use crate::errors::AppError;
use crate::models::subscription::LemonWebhookPayload;
use crate::models::user::PlanTier;
use crate::state::AppState;

pub fn router(state: &AppState) -> Router<AppState> {
    Router::new()
        .route("/webhooks/lemon", post(lemon_webhook))
        .with_state(state.clone())
}

async fn lemon_webhook(
    State(state): State<AppState>,
    headers: axum::http::HeaderMap,
    body: String,
) -> Result<Json<serde_json::Value>, AppError> {
    // 1. Verify HMAC signature
    let signature = headers
        .get("x-signature")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("");

    if !state.lemon_signing_secret.is_empty() {
        let mut mac = Hmac::<Sha256>::new_from_slice(state.lemon_signing_secret.as_bytes())
            .map_err(|_| AppError::Internal("Invalid signing secret".into()))?;
        mac.update(body.as_bytes());
        let expected = hex::encode(mac.finalize().into_bytes());

        if signature != expected {
            return Err(AppError::Unauthorized("Invalid webhook signature".into()));
        }
    }

    // 2. Parse payload
    let payload: LemonWebhookPayload =
        serde_json::from_str(&body).map_err(|e| AppError::BadRequest(format!("Invalid JSON: {e}")))?;

    let event = &payload.meta.event_name;
    let sub_id = &payload.data.id;
    let status = &payload.data.attributes.status;
    let user_email = payload.data.attributes.user_email.as_deref().unwrap_or("");

    tracing::info!("Lemon webhook: event={event}, sub={sub_id}, status={status}");

    match event.as_str() {
        "subscription_created" | "subscription_updated" => {
            let plan = match payload.data.attributes.variant_id {
                Some(1) => PlanTier::Pro,
                Some(2) => PlanTier::Team,
                _ => PlanTier::Pro,
            };

            let renews_at = payload.data.attributes.renews_at.as_deref();

            if let Some(user_id) = find_user_by_email(&state.pool, user_email).await? {
                sqlx::query(
                    "INSERT INTO subscriptions (user_id, lemon_sub_id, plan_tier, status, current_period_end)
                     VALUES ($1, $2, $3, $4, $5::timestamptz)
                     ON CONFLICT (lemon_sub_id) DO UPDATE
                     SET plan_tier = $3, status = $4, current_period_end = $5::timestamptz, updated_at = now()",
                )
                .bind(user_id)
                .bind(sub_id)
                .bind(&plan)
                .bind(status)
                .bind(renews_at.and_then(|s| s.parse::<chrono::DateTime<chrono::Utc>>().ok()))
                .execute(&state.pool)
                .await?;

                if status == "active" {
                    sqlx::query("UPDATE users SET plan = $1, updated_at = now() WHERE id = $2")
                        .bind(&plan)
                        .bind(user_id)
                        .execute(&state.pool)
                        .await?;

                    tracing::info!("Upgraded user {user_id} to {plan:?}");
                }
            }
        }

        "subscription_cancelled" => {
            if let Some(user_id) = find_user_by_email(&state.pool, user_email).await? {
                sqlx::query(
                    "UPDATE subscriptions SET status = 'cancelled', canceled_at = now(), updated_at = now() WHERE lemon_sub_id = $1",
                )
                .bind(sub_id)
                .execute(&state.pool)
                .await?;

                sqlx::query("UPDATE users SET plan = 'free', updated_at = now() WHERE id = $1")
                    .bind(user_id)
                    .execute(&state.pool)
                    .await?;

                tracing::info!("Cancelled subscription for user {user_id}");
            }
        }

        "subscription_payment_failed" => {
            tracing::warn!("Payment failed for sub {sub_id}, user {user_email}");
        }

        _ => {
            tracing::debug!("Unhandled webhook event: {event}");
        }
    }

    Ok(Json(serde_json::json!({ "received": true })))
}

async fn find_user_by_email(
    pool: &sqlx::PgPool,
    email: &str,
) -> Result<Option<uuid::Uuid>, AppError> {
    if email.is_empty() {
        return Ok(None);
    }
    let row = sqlx::query("SELECT id FROM users WHERE email = $1")
        .bind(email)
        .fetch_optional(pool)
        .await?;
    Ok(row.map(|r| r.get("id")))
}
