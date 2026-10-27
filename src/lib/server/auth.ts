import "server-only";
import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

export const ADMIN_COOKIE = "admin_token";
export const ENQUIRY_COOKIE = "enquiry_access";
const ADMIN_MAX_AGE = 60 * 60 * 24; // 1 day
const ENQUIRY_MAX_AGE = 60 * 60 * 8; // 8 hours

function secret() {
  const value = process.env.JWT_SECRET;
  return value ? new TextEncoder().encode(value) : null;
}

const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge,
});

export function adminCredentials() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !secret()) return null;
  return { email: ADMIN_EMAIL, password: ADMIN_PASSWORD };
}

export async function issueAdminSession(email: string) {
  const key = secret();
  if (!key) throw new Error("JWT_SECRET is not set");
  const token = await new SignJWT({ role: "admin", email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(key);
  (await cookies()).set(ADMIN_COOKIE, token, cookieOptions(ADMIN_MAX_AGE));
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  jar.delete(ENQUIRY_COOKIE);
}

async function verify(token: string | undefined, check: (payload: Record<string, unknown>) => boolean) {
  const key = secret();
  if (!key || !token) return false;
  try {
    const { payload } = await jwtVerify(token, key);
    return check(payload);
  } catch {
    return false;
  }
}

export async function isAdmin() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  return verify(token, (p) => p.role === "admin");
}

// Enquiry data is behind a second factor: an admin session plus the access code.
export async function hasEnquiryAccess() {
  if (!(await isAdmin())) return false;
  const token = (await cookies()).get(ENQUIRY_COOKIE)?.value;
  return verify(token, (p) => p.scope === "enquiries");
}

export async function issueEnquiryAccess() {
  const key = secret();
  if (!key) throw new Error("JWT_SECRET is not set");
  const token = await new SignJWT({ scope: "enquiries" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("8h")
    .sign(key);
  (await cookies()).set(ENQUIRY_COOKIE, token, cookieOptions(ENQUIRY_MAX_AGE));
}

export async function revokeEnquiryAccess() {
  (await cookies()).delete(ENQUIRY_COOKIE);
}

/** Route-handler guard: returns a 401 response when the caller isn't an admin. */
export async function requireAdmin() {
  if (await isAdmin()) return null;
  return Response.json({ error: "Not signed in" }, { status: 401 });
}

export async function requireEnquiryAccess() {
  if (await hasEnquiryAccess()) return null;
  return Response.json({ error: "Enquiry access code required" }, { status: 401 });
}
