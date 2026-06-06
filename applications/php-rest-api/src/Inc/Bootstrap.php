<?php

namespace Inc;

use Monolog\Logger;
use Monolog\Handler\StreamHandler;

/**
 * Bootstrap class responsible for initializing the application.
 */
class Bootstrap
{
    public static Logger $logger;

    public static function init(): void
    {
        define('PROJECT_ROOT_PATH', __DIR__ . '/../');

        Config::loadConfig(Config::isProductionEnvironment());

        self::$logger = new Logger('app');
        self::$logger->pushHandler(new StreamHandler(
            __DIR__ . '/../logs/app.log',
            Config::getLogLevel()
        ));

        self::setCorsHeaders(Config::getAllowedOrigins());
    }

    private static function setCorsHeaders(array $allowedOrigins): void
    {
        Cors::setCorsHeaders($allowedOrigins);
    }
}

Bootstrap::init();
