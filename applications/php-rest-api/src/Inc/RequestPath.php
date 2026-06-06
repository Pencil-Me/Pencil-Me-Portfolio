<?php

namespace Inc;

/**
 * Validates and normalizes API request paths.
 */
class RequestPath
{
    private const PATH_PATTERN = '#^/[a-zA-Z0-9_/-]+$#';

    /**
     * Parses the request URI into a normalized API path.
     */
    public static function parse(string $uri): ?string
    {
        $path = parse_url($uri, PHP_URL_PATH);

        if (!is_string($path) || $path === '') {
            return null;
        }

        $path = preg_replace('#/index\.php#', '', $path) ?? $path;

        if ($path === '' || $path === '/') {
            return null;
        }

        if (preg_match(self::PATH_PATTERN, $path) !== 1) {
            return null;
        }

        return $path;
    }
}
