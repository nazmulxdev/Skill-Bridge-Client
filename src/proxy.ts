import { NextRequest, NextResponse } from "next/server";
import { authService } from "./services/authService.server";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const publicPaths = ["/", "/login", "/signup", "/tutors", "/contact"];

  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  const { data, error } = await authService.getSession();

  if (error || !data) {
    return NextResponse.redirect(
      new URL(`/login?redirect=${pathname}`, request.url),
    );
  }

  if (data) {
    if (pathname === "/dashboard") {
      NextResponse.next();
    }
  }

  const userRole = data.user?.role;

  const roleBasedRoutes: { [routePath: string]: string[] } = {
    "/dashboard": ["ADMIN", "TUTOR", "STUDENT"],
    "/dashboard/@admin": ["ADMIN"],
    "/dashboard/admin/:path*": ["ADMIN"],
    "/dashboard/@tutor": ["TUTOR"],
    "/dashboard/tutor/:path*": ["TUTOR"],
    "/dashboard/@student": ["STUDENT"],
    "/dashboard/student/:path*": ["STUDENT"],
    "/tutors/:id": ["ADMIN", "TUTOR", "STUDENT"],
  };

  for (const path in roleBasedRoutes) {
    const regexStr =
      "^" +
      path.replace(/:[^/]+\*/g, ".*").replace(/:[^/]+/g, "[^/]+") +
      "(/.*)?$";
    const dynamicPath = new RegExp(regexStr);
    if (dynamicPath.test(pathname)) {
      if (!roleBasedRoutes[path].includes(userRole)) {
        return NextResponse.redirect(
          new URL(`/login?redirect=${pathname}`, request.url),
        );
      }
      return NextResponse.next();
    }
  }
  return NextResponse.redirect(
    new URL(`/login?redirect=${pathname}`, request.url),
  );
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tutors/:path*",
    "/dashboard/student/:path*",
    "/dashboard/tutor/:path*",
    "/dashboard/admin/:path*",
  ],
};
