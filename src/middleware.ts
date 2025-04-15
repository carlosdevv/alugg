import { betterFetch } from "@better-fetch/fetch";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { appRoutes } from "./lib/constants";

type Session = typeof auth.$Infer.Session;

const publicRoutes = [
  "/api/auth/reference",
  appRoutes.verifyEmail,
  appRoutes.resetPassword,
  appRoutes.plans,
  appRoutes.landing,
];
const authRoutes = [appRoutes.signIn, appRoutes.signUp];

export default async function authMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAuthRoute = authRoutes.includes(pathname);
  const isPublicRoute = publicRoutes.includes(pathname);

  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: process.env.BETTER_AUTH_URL,
      headers: {
        cookie: request.headers.get("cookie") || "", // Forward the cookies from the request
      },
    }
  );

  if (!session) {
    if (isAuthRoute || isPublicRoute) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL(appRoutes.signIn, request.url));
  }

  if (isAuthRoute) {
    return NextResponse.redirect(new URL(appRoutes.onboarding, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
