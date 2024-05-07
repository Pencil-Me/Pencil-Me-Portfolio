<?php

namespace Inc;

use Cors;

/**
 * Bootstrap class responsible for initializing the application by including necessary files.
 */
class Bootstrap
{
    /**
     * Bootstraps the application.
     */
    public static function init(): void
    {
        // Define project root path
        define("PROJECT_ROOT_PATH", __DIR__ . "/../");

        // Include main configuration file
        require_once PROJECT_ROOT_PATH . "/Inc/Config.php";
        require_once PROJECT_ROOT_PATH . "/Inc/Cors.php";
        require_once PROJECT_ROOT_PATH . "/Inc/Router.php";

        // Include the base controller file
        require_once PROJECT_ROOT_PATH . "/Controller/Api/BaseController.php";

        // Set CORS headers
        self::setCorsHeaders(Config::getAllowedOrigins());
    }

    /**
     * Sets CORS headers.
     *
     * @param array $allowedOrigins An array of allowed CORS origins.
     */
    private static function setCorsHeaders(array $allowedOrigins): void
    {
        // Call the setCorsHeaders function from the cors.php file
        Cors::setCorsHeaders($allowedOrigins);
    }
}

// Initialize the application
Bootstrap::init();
