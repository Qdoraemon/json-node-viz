use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

use super::user::PlanTier;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Subscription {
    pub id: Uuid,
    pub user_id: Uuid,
    pub lemon_sub_id: String,
    pub lemon_order_id: Option<String>,
    pub plan_tier: PlanTier,
    pub status: String,
    pub current_period_start: Option<DateTime<Utc>>,
    pub current_period_end: Option<DateTime<Utc>>,
    pub canceled_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

/// Expected Lemon Squeezy webhook payload (simplified).
#[derive(Debug, Deserialize)]
pub struct LemonWebhookPayload {
    pub meta: LemonMeta,
    pub data: LemonData,
}

#[derive(Debug, Deserialize)]
pub struct LemonMeta {
    pub event_name: String,
    pub custom_data: Option<serde_json::Value>,
}

#[derive(Debug, Deserialize)]
pub struct LemonData {
    pub id: String,
    pub attributes: LemonAttributes,
}

#[derive(Debug, Deserialize)]
pub struct LemonAttributes {
    pub status: String,
    pub order_id: Option<u64>,
    pub product_id: Option<u64>,
    pub variant_id: Option<u64>,
    pub user_email: Option<String>,
    pub renews_at: Option<String>,
    pub ends_at: Option<String>,
    pub cancelled: Option<bool>,
}
