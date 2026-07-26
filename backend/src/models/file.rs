use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct File {
    pub id: Uuid,
    pub user_id: Uuid,
    pub name: String,
    pub content: String,
    pub format: String,
    pub size_bytes: i64,
    pub is_public: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateFileRequest {
    pub name: Option<String>,
    pub content: String,
    pub format: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateFileRequest {
    pub name: Option<String>,
    pub content: Option<String>,
    pub format: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct FileSummary {
    pub id: Uuid,
    pub name: String,
    pub format: String,
    pub size_bytes: i64,
    pub updated_at: DateTime<Utc>,
}

impl From<File> for FileSummary {
    fn from(f: File) -> Self {
        Self {
            id: f.id,
            name: f.name,
            format: f.format,
            size_bytes: f.size_bytes,
            updated_at: f.updated_at,
        }
    }
}
