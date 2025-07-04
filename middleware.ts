import { auth } from "@/auth";

export default auth(req => {
	const { pathname } = req.nextUrl;

	const protectedRoutes = ["/billing", "/credentials", "/workflows"];
	const isProtectedRoute =
		pathname === "/" ||
		protectedRoutes.some(route => pathname.startsWith(route));

	if (isProtectedRoute && !req.auth) {
		const newUrl = new URL("/api/auth/signin", req.nextUrl.origin);
		return Response.redirect(newUrl);
	}
});

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
