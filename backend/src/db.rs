use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;
use std::time::Duration;

/// Ensure the DATABASE_URL includes an appropriate sslmode.
/// Render PostgreSQL requires SSL; local dev Postgres usually does not.
fn ensure_ssl(url: &str) -> String {
    if url.contains("sslmode=") {
        return url.to_string();
    }
    // Only force sslmode=require for remote databases (non-localhost)
    if url.contains("localhost") || url.contains("127.0.0.1") {
        return format!("{url}?sslmode=disable");
    }
    if url.contains('?') {
        format!("{url}&sslmode=require")
    } else {
        format!("{url}?sslmode=require")
    }
}

pub async fn init_pool(database_url: &str) -> anyhow::Result<PgPool> {
    let url = ensure_ssl(database_url);
    tracing::info!("Connecting to database (sslmode applied)");

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .acquire_timeout(Duration::from_secs(30))
        .idle_timeout(Duration::from_secs(300))
        .connect(&url)
        .await?;

    sqlx::migrate!("./migrations").run(&pool).await?;

    tracing::info!("Database connected & migrated");
    Ok(pool)
}
