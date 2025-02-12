import { auth } from "@/auth";

export const config = {
  matcher: [
    "/((?!auth|api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

export default auth(async (req) => {
  // if user is not authenticated, redirect to log in
  if (!req.auth) {
    return Response.redirect(new URL("/api/login", req.url));
  }
});
