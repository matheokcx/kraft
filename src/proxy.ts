import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const proxy = async (request: NextRequest): Promise<NextResponse> => {
	const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
	const { pathname } = request.nextUrl;
	const publicRoutes: string[] = ['/sign-in', '/sign-up'];
	const publicApiRoutes: string[] = ['/api/auth'];

	const isPublicPage: boolean = publicRoutes.includes(pathname);
	const isPublicApi: boolean = publicApiRoutes.some((route: string) =>
		pathname.startsWith(route),
	);
	const response = NextResponse.next();
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

	if (pathname.startsWith('/api')) {
		if (!token && !isPublicApi) {
			return NextResponse.json(
				{ error: 'Not authorized, you should be connected' },
				{ status: 401 },
			);
		}

		return response;
	}

	if (!token && !isPublicPage && !pathname.startsWith('/api/auth')) {
		return NextResponse.redirect(new URL('/sign-in', request.url));
	}

	return response;
};

export const config = {
	matcher: ['/', '/clients', '/projects', '/profile/:path*', '/api/:path*'],
};
