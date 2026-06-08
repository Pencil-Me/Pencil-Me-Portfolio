<?php

namespace Inc;

require_once __DIR__ . '/CorsHeaders.php';

/**
 * CORS vor Bootstrap/autoload — delegiert an CorsHeaders (.env.prod direkt lesen).
 */
final class EarlyCors
{
    /**
     * @param string $incDir Absoluter Pfad zu src/Inc
     */
    public static function handle(string $incDir): void
    {
        CorsHeaders::bootstrapFromEnvDir($incDir);
        CorsHeaders::rejectDisallowedExplicitOrigin();
    }
}
