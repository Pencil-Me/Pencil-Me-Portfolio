<?php

/**
 * Cors class responsible for handling Cross-Origin Resource Sharing (CORS) headers.
 */
class Cors
{
    /**
     * Sets CORS headers based on allowed origins.
     *
     * @param array $allowedOrigins An array of allowed origins.
     */
    public static function setCorsHeaders(array $allowedOrigins): void
    {
        // Allow from any origin if Origin header is present and allowed
        if (isset($_SERVER["HTTP_ORIGIN"]) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
            self::handleCorsRequest($_SERVER['HTTP_ORIGIN']);
        }

        // Handle preflight requests (OPTIONS method)
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            self::handlePreflightRequest();
        }
    }

    /**
     * Handles CORS headers for the specified origin.
     *
     * @param string $origin The origin for which CORS headers are set.
     */
    private static function handleCorsRequest(string $origin): void
    {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, api-key");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Max-Age: 600"); // Cache for 10 minutes
    }

    /**
     * Handles preflight requests (OPTIONS method).
     */
    private static function handlePreflightRequest(): void
    {
        header("HTTP/1.1 200 OK");
        exit();
    }
}
