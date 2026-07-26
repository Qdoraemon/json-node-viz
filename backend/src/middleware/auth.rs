use axum::{
    extract::Request,
    middleware::Next,
    response::{IntoResponse, Response},
};
use axum::http::StatusCode;
use axum_extra::extract::cookie::CookieJar;
use serde_json::json;
use uuid::Uuid;

pub const SESSION_COOKIE: &str = "jsonviz_session";

pub fn get_user_id(jar: &CookieJar) -> Option<Uuid> {
    jar.get(SESSION_COOKIE)
        .and_then(|c| Uuid::parse_str(c.value()).ok())
}

pub async fn require_auth(mut req: Request, next: Next) -> Response {
    let jar = CookieJar::from_headers(req.headers());
    match get_user_id(&jar) {
        Some(user_id) => {
            req.extensions_mut().insert(user_id);
            next.run(req).await
        }
        None => {
            let body = json!({ "error": "Not logged in" });
            (StatusCode::UNAUTHORIZED, axum::Json(body)).into_response()
        }
    }
}
