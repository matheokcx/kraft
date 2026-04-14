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

export const getUserRateLimit = (key: string, limit: number = 10, windowMs: number = 60000): UserRateLimitInfo => {
    const dateNumber: number = Date.now()
    const userLimit: RateLimit | undefined = rateLimitsMap.get(key)

    if (!userLimit || (dateNumber > userLimit.resetTime)) {
        rateLimitsMap.set(key, { count: 1, resetTime: dateNumber + windowMs })
        return {
            success: true,
            remaining: limit - 1
        }
    }

    if (userLimit.count >= limit) {
        return {
            success: false,
            remaining: 0,
            resetTime: userLimit.resetTime
        }
    }

    userLimit.count += 1;

    return {
        success: true,
        remaining: limit - userLimit.count
    };
};
