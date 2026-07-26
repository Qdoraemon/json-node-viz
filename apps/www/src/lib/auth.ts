export type AuthUser = {
  id: string;
  email: string;
  plan: "Free" | "Pro" | "Team" | "free" | "pro" | "team";
  email_verified: boolean;
  created_at: string;
};

type ApiErrorBody = {
  error?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "https://json-node-viz.onrender.com";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    let message = "Request failed";
    try {
      const body = (await response.json()) as ApiErrorBody;
      if (body.error) {
        message = body.error;
      }
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const raw = await response.text();
  if (!raw) {
    return undefined as T;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    // Some endpoints may return non-JSON text with 2xx status.
    return undefined as T;
  }
}

export async function getCurrentUser(): Promise<AuthUser> {
  return request<AuthUser>("/auth/me", { method: "GET" });
}

export async function login(email: string, password: string): Promise<AuthUser> {
  return request<AuthUser>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logout(): Promise<void> {
  await request("/auth/logout", { method: "POST" });
}

export async function sendRegisterCode(email: string): Promise<void> {
  await request("/auth/send-register-code", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function registerWithCode(
  email: string,
  code: string,
  password: string
): Promise<AuthUser> {
  return request<AuthUser>("/auth/register-with-code", {
    method: "POST",
    body: JSON.stringify({ email, code, password }),
  });
}
