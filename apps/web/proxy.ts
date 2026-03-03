import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionForPage } from "./utils/session";

const AUTH_ROUTES = ["/", "/signin", "/signup"];

export async function proxy(request: NextRequest) {
  let pathname = request.nextUrl.pathname;

  let isAuthenticated = await getSessionForPage();

  if (AUTH_ROUTES.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.includes("dashboard") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/", "/signin", "/signup", "/:before*/dashboard/:after*"],
};
