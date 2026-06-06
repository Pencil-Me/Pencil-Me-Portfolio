<?php

namespace Inc;

/**
 * Session-based rate limiter (legacy).
 *
 * Read endpoints no longer use this class. Contact mail is rate-limited at the
 * Nginx gateway (`limit_req` on `/api2/send_email`). Kept for reference only.
 */
class RateLimiter
{
    private static int $maxRequests = 100;
    private static int $timeWindow = 3600;

    public static function isRequestAllowed(string $identifier): bool
    {
        $currentTime = time();
        $requests = self::getRequests($identifier);

        $requests = array_filter($requests, static function ($timestamp) use ($currentTime) {
            return ($timestamp + self::$timeWindow) > $currentTime;
        });

        if (count($requests) >= self::$maxRequests) {
            return false;
        }

        $requests[] = $currentTime;
        self::storeRequests($identifier, $requests);

        return true;
    }

    private static function getRequests(string $identifier): array
    {
        return $_SESSION['rate_limit'][$identifier] ?? [];
    }

    private static function storeRequests(string $identifier, array $requests): void
    {
        $_SESSION['rate_limit'][$identifier] = $requests;
    }
}
