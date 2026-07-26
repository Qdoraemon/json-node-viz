use axum::{
    extract::{Request, State},
    middleware::Next,
    response::{IntoResponse, Response},
};
use axum::http::StatusCode;
use serde_json::json;
use sqlx::Row;
use uuid::Uuid;

use crate::models::user::PlanTier;
use crate::state::AppState;

pub fn require_plan(
    min_plan: PlanTier,
) -> impl Fn(State<AppState>, Request, Next) -> std::pin::Pin<Box<dyn std::future::Future<Output = Response> + Send>> + Clone
{
    move |State(state): State<AppState>, req: Request, next: Next| {
        let min = min_plan;
        Box::pin(async move {
            let user_id = match req.extensions().get::<Uuid>().copied() {
                Some(id) => id,
                None => {
                    let body = json!({ "error": "Not logged in" });
                    return (StatusCode::UNAUTHORIZED, axum::Json(body)).into_response();
                }
            };

            let row = sqlx::query("SELECT plan FROM users WHERE id = $1")
                .bind(user_id)
                .fetch_optional(&state.pool)
                .await;

            let plan = match row {
                Ok(Some(r)) => r.get::<PlanTier, _>("plan"),
                _ => PlanTier::Free,
            };

            if (plan as i32) < (min as i32) {
                let msg = format!("Requires {:?} plan or higher. Your plan: {:?}", min, plan);
                let body = json!({ "error": msg });
                return (StatusCode::FORBIDDEN, axum::Json(body)).into_response();
            }

            next.run(req).await
        })
    }
}

pub fn file_size_limit(plan: PlanTier) -> usize {
    match plan {
        PlanTier::Free => 1_048_576,
        PlanTier::Pro => 104_857_600,
        PlanTier::Team => usize::MAX,
    }
}
