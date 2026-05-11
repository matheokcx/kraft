import { NextRequest, NextResponse } from 'next/server';

export type UserRateLimitInfo = {
	success: boolean;
	remaining: number;
	resetTime?: number;
};

type RateLimit = {
	count: number;
	resetTime: number;
};

const rateLimitsMap = new Map<string, RateLimit>();

export const getClientIp = (
	request: NextRequest | { headers: Headers | Record<string, string | string[] | undefined> },
): string => {
	const headers: Headers | Record<string, string | string[] | undefined> = request.headers;
	const get = (name: string): string | undefined => {
		if (headers instanceof Headers) {
			return headers.get(name) ?? undefined;
		}

		const value: string | string[] | undefined = headers[name] ?? headers[name.toLowerCase()];
		return Array.isArray(value) ? value[0] : value;
	};
	const forwarded: string | undefined = get('x-forwarded-for');
	if (forwarded) {
		return forwarded.split(',')[0].trim();
	}
	return get('x-real-ip') ?? 'unknown';
};

export const enforceRateLimit = (
	key: string,
	limit: number = 10,
	windowMs: number = 60_000,
): NextResponse | null => {
	const info: UserRateLimitInfo = getUserRateLimit(key, limit, windowMs);

	if (info.success) {
		return null;
	}

	const retryAfter: number = info.resetTime
		? Math.max(0, Math.ceil((info.resetTime - Date.now()) / 1000))
		: 60;
	return NextResponse.json(
		{ error: 'Trop de requêtes. Veuillez réessayer plus tard.' },
		{ status: 429, headers: { 'Retry-After': String(retryAfter) } },
	);
};

export const getUserRateLimit = (
	key: string,
	limit: number = 10,
	windowMs: number = 60000,
): UserRateLimitInfo => {
	const dateNumber: number = Date.now();
	const userLimit: RateLimit | undefined = rateLimitsMap.get(key);

	if (!userLimit || dateNumber > userLimit.resetTime) {
		rateLimitsMap.set(key, { count: 1, resetTime: dateNumber + windowMs });
		return {
			success: true,
			remaining: limit - 1,
		};
	}

	if (userLimit.count >= limit) {
		return {
			success: false,
			remaining: 0,
			resetTime: userLimit.resetTime,
		};
	}

	userLimit.count += 1;

	return {
		success: true,
		remaining: limit - userLimit.count,
	};
};
