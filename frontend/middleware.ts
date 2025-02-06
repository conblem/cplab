export { auth as middleware } from "@/auth"

// export const config = {
//     matcher: [
//         '/((?!auth|api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
//     ],
// }
//
// export default auth(async (req) => {
//     if (!req.auth) {
//         return Response.redirect(new URL(`/auth/login?redirect=${req.nextUrl.pathname}`, req.url,))
//     }
//     //
//     // const headers = new Headers(req.headers);
//     // headers.set("x-current-path", req.nextUrl.pathname);
//     // return NextResponse.next({headers});
// })
