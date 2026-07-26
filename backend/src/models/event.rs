use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Event {
    pub id: Uuid,
    pub user_id: Option<Uuid>,
    pub event_type: String,
    pub feature: String,
    pub ip_address: Option<String>,
    pub user_agent: Option<String>,
    pub metadata: Option<serde_json::Value>,
    pub created_at: DateTime<Utc>,
}

/// Request body sent from the frontend.
#[derive(Debug, Deserialize)]
pub struct TrackEventRequest {
    pub event_type: String,
    pub feature: String,
    #[serde(default)]
    pub metadata: Option<serde_json::Value>,
}
