use std::env;

#[derive(Clone)]
pub struct AppConfig {
    pub database_url: String,
    pub session_secret: String,
    pub lemon_signing_secret: String,
    pub lemon_api_key: String,
    pub mock_email: bool,
    pub resend_api_key: String,
    pub resend_from_email: String,
    pub frontend_origin: String,
    pub host: String,
    pub port: u16,
}

impl AppConfig {
    pub fn from_env() -> anyhow::Result<Self> {
        Ok(Self {
            database_url: env::var("DATABASE_URL")
                .map_err(|_| anyhow::anyhow!("DATABASE_URL not set"))?,
            session_secret: env::var("SESSION_SECRET")
                .map_err(|_| anyhow::anyhow!("SESSION_SECRET not set"))?,
            lemon_signing_secret: env::var("LEMON_SQUEEZY_SIGNING_SECRET").unwrap_or_default(),
            lemon_api_key: env::var("LEMON_SQUEEZY_API_KEY").unwrap_or_default(),
            mock_email: env::var("MOCK_EMAIL")
                .unwrap_or_else(|_| "true".into())
                .eq_ignore_ascii_case("true"),
            resend_api_key: env::var("RESEND_API_KEY").unwrap_or_default(),
            resend_from_email: env::var("RESEND_FROM_EMAIL")
                .unwrap_or_else(|_| "JsonViz <noreply@mail.fluxhub.dev>".into()),
            frontend_origin: env::var("FRONTEND_ORIGIN")
                .unwrap_or_else(|_| "http://localhost:3000".into()),
            host: env::var("HOST").unwrap_or_else(|_| "0.0.0.0".into()),
            port: env::var("PORT").unwrap_or_else(|_| "3001".into()).parse()?,
        })
    }
}
