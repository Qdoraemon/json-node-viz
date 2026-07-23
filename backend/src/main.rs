use axum::http::HeaderValue;
use axum::{routing::get, Extension, Json, Router};
use serde_json::json;
use state::AppState;
use tower_http::cors::{AllowCredentials, CorsLayer};
use tower_http::trace::TraceLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};

mod config;
mod db;
mod errors;
mod middleware;
mod models;
mod routes;
mod state;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().ok();

    tracing_subscriber::registry()
        .with(EnvFilter::try_from_default_env().unwrap_or_else(|_| "backend=debug".into()))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let cfg = config::AppConfig::from_env()?;
    let pool = db::init_pool(&cfg.database_url).await?;

    let app_state = AppState::new(
        pool.clone(),
        &cfg.session_secret,
        cfg.lemon_signing_secret.clone(),
        cfg.mock_email,
        cfg.resend_api_key.clone(),
        cfg.resend_from_email.clone(),
    );

    let cors = CorsLayer::new()
        .allow_origin(
            cfg.frontend_origin
                .parse::<HeaderValue>()
                .expect("valid FRONTEND_ORIGIN"),
        )
        .allow_methods([
            axum::http::Method::GET,
            axum::http::Method::POST,
            axum::http::Method::PUT,
            axum::http::Method::DELETE,
            axum::http::Method::OPTIONS,
        ])
        .allow_headers([
            axum::http::header::CONTENT_TYPE,
            axum::http::header::AUTHORIZATION,
            axum::http::header::HeaderName::from_static("x-requested-with"),
        ])
        .allow_credentials(AllowCredentials::yes());

    let app = Router::new()
        .route("/health", get(health))
        .merge(routes::auth::router())
        .merge(routes::files::router())
        .merge(routes::webhooks::router(&app_state))
        .layer(TraceLayer::new_for_http())
        .layer(cors)
        .layer(Extension(pool))
        .with_state(app_state);

    let addr = format!("{}:{}", cfg.host, cfg.port);
    tracing::info!("Starting server on http://{addr}");

    let listener = tokio::net::TcpListener::bind(&addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}

async fn health() -> Json<serde_json::Value> {
    Json(json!({ "status": "ok" }))
}
