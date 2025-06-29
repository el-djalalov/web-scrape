import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const protectedRoutes = [
	"/billing",
	"/credentials",
	"/workflows",
];

export default async function middleware(request: NextRequest) {
	const session = await auth();
	const { pathname } = request.nextUrl;

    if (pathname.startsWith('/api/auth')) {
        return NextResponse.next();
    }

	const isProtectedRoute = pathname === '/' || protectedRoutes.some(route =>
		pathname.startsWith(route)
	);

	if (isProtectedRoute && !session) {
		return NextResponse.redirect(new URL("/api/auth/sign-in", request.url));
	}
	return NextResponse.next();
}

