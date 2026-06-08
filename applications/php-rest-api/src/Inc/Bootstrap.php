<?php

namespace Inc;

/**
 * Bootstrap class responsible for initializing the application.
 */
class Bootstrap
{
    public static AppLogger $logger;

    public static function init(): void
    {
        define('PROJECT_ROOT_PATH', __DIR__ . '/../');

        Config::loadConfig(Config::isProductionEnvironment());
        CorsHeaders::bootstrapFromConfig();

        self::$logger = new AppLogger(
            __DIR__ . '/../logs/app.log',
            Config::getLogLevel()
        );
    }
}

Bootstrap::init();
