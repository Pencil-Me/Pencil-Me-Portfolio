<?php

namespace Inc;

use Monolog\Logger;
use Monolog\Handler\StreamHandler;

session_start();

/**
 * Bootstrap class responsible for initializing the application by including necessary files.
 */
class Bootstrap
{
    public static Logger $logger;

    public static function init(): void
    {
        define('PROJECT_ROOT_PATH', __DIR__ . '/../');

        require_once PROJECT_ROOT_PATH . '/Inc/Config.php';
        Config::loadConfig(Config::isProductionEnvironment());

        self::$logger = new Logger('app');
        self::$logger->pushHandler(new StreamHandler(
            __DIR__ . '/../logs/app.log',
            Config::getLogLevel()
        ));

        require_once PROJECT_ROOT_PATH . '/Inc/Cors.php';
        require_once PROJECT_ROOT_PATH . '/Inc/Router.php';
        require_once PROJECT_ROOT_PATH . '/Controller/Api/BaseController.php';
        require_once PROJECT_ROOT_PATH . '/Model/ProjectsModel.php';
        require_once PROJECT_ROOT_PATH . '/Model/TechstackModel.php';
        require_once PROJECT_ROOT_PATH . '/Model/CustomersModel.php';

        self::setCorsHeaders(Config::getAllowedOrigins());
    }

    private static function setCorsHeaders(array $allowedOrigins): void
    {
        Cors::setCorsHeaders($allowedOrigins);
    }
}

Bootstrap::init();
