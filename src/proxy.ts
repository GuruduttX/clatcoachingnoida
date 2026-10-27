import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Optimistic gate for admin screens. The API routes check the session again
// themselves, so this only decides which page to show.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const onLogin = pathname.startsWith("/admin-login");
  const signedIn = await isSignedIn(request.cookies.get("admin_token")?.value);

  if (onLogin) {
    return signedIn ? NextResponse.redirect(new URL("/admin", request.url)) : NextResponse.next();
  }
  if (signedIn) return NextResponse.next();

  const login = new URL("/admin-login", request.url);
  login.searchParams.set("next", pathname);
  const response = NextResponse.redirect(login);
  response.cookies.delete("admin_token");
  return response;
}

async function isSignedIn(token: string | undefined) {
  const secret = process.env.JWT_SECRET;
  if (!token || !secret) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/admin-login"],
};
