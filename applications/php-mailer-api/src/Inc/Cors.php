<?php

namespace Inc;

/**
 * Cross-Origin Resource Sharing (CORS) headers.
 */
class Cors
{
    /**
     * @param array<int, string> $allowedOrigins
     */
    public static function setCorsHeaders(array $allowedOrigins): void
    {
        if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins, true)) {
            self::handleCorsRequest($_SERVER['HTTP_ORIGIN']);
        }

        if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
            self::handlePreflightRequest();
        }
    }

    private static function handleCorsRequest(string $origin): void
    {
        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, api-key');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 600');
    }

    private static function handlePreflightRequest(): void
    {
        header('HTTP/1.1 200 OK');
        exit();
    }
}
