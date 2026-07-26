const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "https://json-node-viz.onrender.com";

export interface TrackPayload {
  event_type: string;
  feature: string;
  metadata?: Record<string, unknown>;
}

/**
 * Send a tracking event to the backend.
 * Fire-and-forget — errors are silently caught so they never block the UI.
 */
export function track(feature: string, metadata?: Record<string, unknown>): void {
  const payload: TrackPayload = {
    event_type: "click",
    feature,
    metadata,
  };

  fetch(`${API_BASE}/events/track`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {
    // Silently ignore — tracking must never break the app
  });
}
