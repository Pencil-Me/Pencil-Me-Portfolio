<?php

namespace Inc;

class RateLimiter
{
    private static int $maxRequests = 100; // Max requests allowed
    private static int $timeWindow = 3600; // Time window in seconds (1 hour)

    /**
     * Checks if the request is allowed based on the rate limit.
     *
     * @param string $identifier Unique identifier for the client (e.g., IP address).
     * @return bool True if the request is allowed, false otherwise.
     */
    public static function isRequestAllowed(string $identifier): bool
    {
        $currentTime = time();
        $requests = self::getRequests($identifier);

        // Remove expired requests
        $requests = array_filter($requests, function ($timestamp) use ($currentTime) {
            return ($timestamp + self::$timeWindow) > $currentTime;
        });

        // Check if the number of requests exceeds the limit
        if (count($requests) >= self::$maxRequests) {
            return false;
        }

        // Add the current request timestamp
        $requests[] = $currentTime;
        self::storeRequests($identifier, $requests);

        return true;
    }

    /**
     * Retrieves the request timestamps for the given identifier.
     *
     * @param string $identifier Unique identifier for the client.
     * @return array An array of request timestamps.
     */
    private static function getRequests(string $identifier): array
    {
        // In a real application, use a persistent storage like Redis or a database
        return $_SESSION['rate_limit'][$identifier] ?? [];
    }

    /**
     * Stores the request timestamps for the given identifier.
     *
     * @param string $identifier Unique identifier for the client.
     * @param array $requests An array of request timestamps.
     */
    private static function storeRequests(string $identifier, array $requests): void
    {
        // In a real application, use a persistent storage like Redis or a database
        $_SESSION['rate_limit'][$identifier] = $requests;
    }
}
