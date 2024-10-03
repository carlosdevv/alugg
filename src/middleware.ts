import { appRoutes } from "@/lib/constants";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/auth/sign-in(.*)",
  "/auth/sign-up(.*)",
  "/api/auth(.*)",
]);

export default clerkMiddleware((auth, request) => {
  const { userId } = auth();
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  if (pathname.includes("/org")) {
    const [, , slug] = pathname.split("/");

    response.cookies.set("org", slug);
  } else {
    console.log("djakdajkda");
    response.cookies.delete("org");
  }

  if (isPublicRoute(request) && userId) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = appRoutes.onboarding;
    return NextResponse.redirect(redirectUrl);
  }

  if (!isPublicRoute(request)) {
    auth().protect();
  }

  

  // const org = request.cookies.get("org");
  // if (org && org.value !== "" && ["/", appRoutes.home].includes(pathname)) {
  //   const redirectUrl = request.nextUrl.clone();
  //   redirectUrl.pathname = `/org/${org.value}`;
  //   return NextResponse.redirect(redirectUrl);
  // }

  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
