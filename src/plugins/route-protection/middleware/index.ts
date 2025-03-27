import type { auth } from "@/lib/auth";
import { betterFetch } from "@better-fetch/fetch";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ProtectedRoute } from "../server";

type Session = typeof auth.$Infer.Session;

export async function routeProtectionMiddleware(request: NextRequest) {
  // Get the current path
  const path = request.nextUrl.pathname;

  // Skip checking static files and Next.js internals
  if (
    path.startsWith("/_next") ||
    path.startsWith("/static") ||
    path.startsWith("/api/auth") ||
    path.includes(".")
  ) {
    return NextResponse.next();
  }

  // Get the session
  const { data: session } = await betterFetch<Session>("/api/auth/get-session", {
    baseURL: request.nextUrl.origin,
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  // Admin users have access to all routes
  if (session?.user?.role === "admin") {
    return NextResponse.next();
  }

  // Get protected routes from the endpoint
  const { data: protectedRoutes } = await betterFetch<ProtectedRoute[]>("/api/auth/protected-routes", {
    baseURL: request.nextUrl.origin,
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  // If no protected routes found in database, allow all access
  if (!protectedRoutes || protectedRoutes.length === 0) {
    return NextResponse.next();
  }

  // Check if the current path matches any protected route
  const protectedRoute = protectedRoutes.find(route => {
    const routePattern = route.path
      .replace(/\*/g, ".*") // Replace * with regex pattern
      .replace(/\/$/, ""); // Remove trailing slash if present
    const routeRegex = new RegExp(`^${routePattern}$`);
    return routeRegex.test(path);
  });

  // If no protected route found, allow access
  if (!protectedRoute) {
    return NextResponse.next();
  }

  // Check authentication
  if (protectedRoute.requiresAuth && !session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Check role requirements
  if (session?.user?.role && !protectedRoute.roles.includes(session.user.role)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}
