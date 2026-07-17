use axum_extra::extract::cookie::Key;
use sqlx::PgPool;

/// Unified application state shared across all routes.
#[derive(Clone)]
pub struct AppState {
    pub pool: PgPool,
    pub cookie_key: Key,
    pub lemon_signing_secret: String,
    pub mock_email: bool,
    pub resend_api_key: String,
    pub resend_from_email: String,
    pub http_client: reqwest::Client,
}

impl AppState {
    pub fn new(
        pool: PgPool,
        secret: &str,
        lemon_signing_secret: String,
        mock_email: bool,
        resend_api_key: String,
        resend_from_email: String,
    ) -> Self {
        Self {
            pool,
            cookie_key: Key::from(secret.as_bytes()),
            lemon_signing_secret,
            mock_email,
            resend_api_key,
            resend_from_email,
            http_client: reqwest::Client::new(),
        }
    }
}
