// types/next-auth.d.ts
import NextAuth from 'next-auth';

declare module 'next-auth' {
	interface Session {
		user?: {
			id?: string;
			name?: string | null;
			email?: string | null;
			image?: string | null;
			gender?: string | null;
			birthday?: string | null;
			phoneNumber?: string | null;
			country?: string | null;
			createdAt?: string | null;
		};
	}
}
