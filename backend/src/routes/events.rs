use axum::{extract::State, http::HeaderMap, routing::post, Json, Router};
use serde_json::json;

use crate::middleware::auth::get_user_id;
use crate::models::event::TrackEventRequest;
use crate::state::AppState;

pub fn router() -> Router<AppState> {
    Router::new().route("/events/track", post(track_event))
}

async fn track_event(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(body): Json<TrackEventRequest>,
) -> Result<Json<serde_json::Value>, crate::errors::AppError> {
    // Extract optional user_id from session cookie
    let user_id = {
        let jar = axum_extra::extract::cookie::CookieJar::from_headers(&headers);
        get_user_id(&jar)
    };

    // Extract IP from x-forwarded-for or x-real-ip headers (Render proxy)
    let ip_address = headers
        .get("x-forwarded-for")
        .and_then(|v| v.to_str().ok())
        .map(|s| s.split(',').next().unwrap_or(s).trim().to_string())
        .or_else(|| {
            headers
                .get("x-real-ip")
                .and_then(|v| v.to_str().ok())
                .map(|s| s.to_string())
        });

    let user_agent = headers
        .get(axum::http::header::USER_AGENT)
        .and_then(|v| v.to_str().ok())
        .map(|s| s.to_string());

    sqlx::query(
        r#"INSERT INTO events (user_id, event_type, feature, ip_address, user_agent, metadata)
           VALUES ($1, $2, $3, $4, $5, $6)"#,
    )
    .bind(user_id)
    .bind(&body.event_type)
    .bind(&body.feature)
    .bind(&ip_address)
    .bind(&user_agent)
    .bind(&body.metadata)
    .execute(&state.pool)
    .await?;

    Ok(Json(json!({ "ok": true })))
}
