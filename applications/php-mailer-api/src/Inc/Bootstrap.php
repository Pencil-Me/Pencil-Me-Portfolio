<?php

namespace Inc;

/**
 * Application bootstrap — Config and CORS only (autoload via Composer).
 */
class Bootstrap
{
    public static function init(): void
    {
        if (!defined('PROJECT_ROOT_PATH')) {
            define('PROJECT_ROOT_PATH', __DIR__ . '/../');
        }

        Config::loadConfig(Config::isProductionEnvironment());
        self::setCorsHeaders(Config::getAllowedOrigins());
    }

    /**
     * @param array<int, string> $allowedOrigins
     */
    private static function setCorsHeaders(array $allowedOrigins): void
    {
        Cors::setCorsHeaders($allowedOrigins);
    }
}
