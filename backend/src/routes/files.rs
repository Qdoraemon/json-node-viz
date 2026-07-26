use axum::{
    extract::{Path, State},
    middleware, Extension,
    routing::get,
    Json, Router,
};
use sqlx::Row;
use uuid::Uuid;

use crate::errors::AppError;
use crate::middleware::auth::require_auth;
use crate::middleware::plan_guard::file_size_limit;
use crate::models::file::{CreateFileRequest, File, FileSummary, UpdateFileRequest};
use crate::models::user::PlanTier;
use crate::state::AppState;

pub fn router() -> Router<AppState> {
    Router::new()
        .route(
            "/files",
            get(list_files)
                .post(create_file)
                .route_layer(middleware::from_fn(require_auth)),
        )
        .route(
            "/files/{id}",
            get(get_file)
                .put(update_file)
                .delete(delete_file)
                .route_layer(middleware::from_fn(require_auth)),
        )
}

fn row_to_file(row: &sqlx::postgres::PgRow) -> File {
    File {
        id: row.get("id"),
        user_id: row.get("user_id"),
        name: row.get("name"),
        content: row.get("content"),
        format: row.get("format"),
        size_bytes: row.get("size_bytes"),
        is_public: row.get("is_public"),
        created_at: row.get("created_at"),
        updated_at: row.get("updated_at"),
    }
}

async fn list_files(
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
) -> Result<Json<Vec<FileSummary>>, AppError> {
    let rows = sqlx::query(
        "SELECT id, user_id, name, content, format, size_bytes, is_public, created_at, updated_at FROM files WHERE user_id = $1 ORDER BY updated_at DESC",
    )
    .bind(user_id)
    .fetch_all(&state.pool)
    .await?;

    let files: Vec<FileSummary> = rows.iter().map(|r| {
        let f = File {
            id: r.get("id"),
            user_id: r.get("user_id"),
            name: r.get("name"),
            content: r.get("content"),
            format: r.get("format"),
            size_bytes: r.get("size_bytes"),
            is_public: r.get("is_public"),
            created_at: r.get("created_at"),
            updated_at: r.get("updated_at"),
        };
        FileSummary::from(f)
    }).collect();

    Ok(Json(files))
}

async fn get_file(
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
    Path(file_id): Path<Uuid>,
) -> Result<Json<File>, AppError> {
    let row = sqlx::query(
        "SELECT id, user_id, name, content, format, size_bytes, is_public, created_at, updated_at FROM files WHERE id = $1 AND user_id = $2",
    )
    .bind(file_id)
    .bind(user_id)
    .fetch_optional(&state.pool)
    .await?
    .ok_or_else(|| AppError::NotFound("File not found".into()))?;

    Ok(Json(row_to_file(&row)))
}

async fn create_file(
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
    Json(payload): Json<CreateFileRequest>,
) -> Result<(axum::http::StatusCode, Json<File>), AppError> {
    let name = payload.name.unwrap_or_else(|| "untitled".into());
    let format = payload.format.unwrap_or_else(|| "json".into());
    let size_bytes = payload.content.len() as i64;

    let plan_row = sqlx::query("SELECT plan FROM users WHERE id = $1")
        .bind(user_id)
        .fetch_optional(&state.pool)
        .await?
        .map(|r| r.get::<PlanTier, _>("plan"))
        .unwrap_or(PlanTier::Free);

    let limit = file_size_limit(plan_row);
    if size_bytes > limit as i64 {
        return Err(AppError::Forbidden(format!(
            "File too large. {:?} plan limit: {} bytes, file: {} bytes",
            plan_row, limit, size_bytes
        )));
    }

    let row = sqlx::query(
        "INSERT INTO files (user_id, name, content, format, size_bytes) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_id, name, content, format, size_bytes, is_public, created_at, updated_at",
    )
    .bind(user_id)
    .bind(&name)
    .bind(&payload.content)
    .bind(&format)
    .bind(size_bytes)
    .fetch_one(&state.pool)
    .await?;

    Ok((axum::http::StatusCode::CREATED, Json(row_to_file(&row))))
}

async fn update_file(
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
    Path(file_id): Path<Uuid>,
    Json(payload): Json<UpdateFileRequest>,
) -> Result<Json<File>, AppError> {
    let existing = sqlx::query(
        "SELECT id, user_id, name, content, format, size_bytes, is_public, created_at, updated_at FROM files WHERE id = $1 AND user_id = $2",
    )
    .bind(file_id)
    .bind(user_id)
    .fetch_optional(&state.pool)
    .await?
    .ok_or_else(|| AppError::NotFound("File not found".into()))?;

    let name = payload.name.unwrap_or_else(|| existing.get("name"));
    let format = payload.format.unwrap_or_else(|| existing.get("format"));
    let content = payload.content.unwrap_or_else(|| existing.get("content"));
    let size_bytes = content.len() as i64;

    let plan_row = sqlx::query("SELECT plan FROM users WHERE id = $1")
        .bind(user_id)
        .fetch_optional(&state.pool)
        .await?
        .map(|r| r.get::<PlanTier, _>("plan"))
        .unwrap_or(PlanTier::Free);

    let limit = file_size_limit(plan_row);
    if size_bytes > limit as i64 {
        return Err(AppError::Forbidden(format!(
            "File too large. {:?} plan limit: {} bytes, file: {} bytes",
            plan_row, limit, size_bytes
        )));
    }

    let row = sqlx::query(
        "UPDATE files SET name = $3, content = $4, format = $5, size_bytes = $6, updated_at = now() WHERE id = $1 AND user_id = $2 RETURNING id, user_id, name, content, format, size_bytes, is_public, created_at, updated_at",
    )
    .bind(file_id)
    .bind(user_id)
    .bind(&name)
    .bind(&content)
    .bind(&format)
    .bind(size_bytes)
    .fetch_one(&state.pool)
    .await?;

    Ok(Json(row_to_file(&row)))
}

async fn delete_file(
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
    Path(file_id): Path<Uuid>,
) -> Result<Json<serde_json::Value>, AppError> {
    let result = sqlx::query("DELETE FROM files WHERE id = $1 AND user_id = $2")
        .bind(file_id)
        .bind(user_id)
        .execute(&state.pool)
        .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound("File not found".into()));
    }

    Ok(Json(serde_json::json!({ "deleted": true })))
}
