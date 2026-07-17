use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

/// Mirrors the `plan_tier` Postgres enum.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "plan_tier", rename_all = "lowercase")]
pub enum PlanTier {
    Free,
    Pro,
    Team,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct User {
    pub id: Uuid,
    pub email: String,
    #[serde(skip_serializing)]
    pub password_hash: String,
    pub plan: PlanTier,
    pub email_verified_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

/// Public-safe user info (no password hash).
#[derive(Debug, Serialize)]
pub struct UserPublic {
    pub id: Uuid,
    pub email: String,
    pub plan: PlanTier,
    pub email_verified: bool,
    pub created_at: DateTime<Utc>,
}

impl From<User> for UserPublic {
    fn from(u: User) -> Self {
        Self {
            id: u.id,
            email: u.email,
            plan: u.plan,
            email_verified: u.email_verified_at.is_some(),
            created_at: u.created_at,
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct RegisterRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct SendRegisterCodeRequest {
    pub email: String,
}

#[derive(Debug, Deserialize)]
pub struct RegisterWithCodeRequest {
    pub email: String,
    pub code: String,
    pub password: String,
}
