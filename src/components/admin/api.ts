"use client";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors: Record<string, string> = {},
  ) {
    super(message);
  }
}

/** JSON fetch for admin screens. An expired session sends the admin back to sign in. */
export async function adminApi<T>(url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: init.body && !(init.body instanceof FormData) ? { "Content-Type": "application/json", ...init.headers } : init.headers,
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && data?.error === "Not signed in") {
    // A full reload clears every in-memory admin screen along with the session.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = `/admin-login?next=${encodeURIComponent(window.location.pathname)}`;
  }
  if (!res.ok) throw new ApiError(data?.error ?? "Request failed", res.status, data?.errors ?? {});
  return data as T;
}

export function timeAgo(iso?: string) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d} d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
