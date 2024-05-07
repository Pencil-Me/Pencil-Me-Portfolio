<?php

namespace Inc;

use Dotenv;

/**
 * Holds the configuration information of our application.
 * Mainly, it holds the database credentials and allowed origins for CORS.
 */
class Config
{
    /** @var array $allowedOrigins An array of allowed CORS origins. */
    public static array $allowedOrigins = [];

    /** @var array $apiKeys An array of API keys. */
    public static array $apiKeys = [];

    /** @var string $dbHost The database host. */
    public static string $dbHost = '';

    /** @var string $dbPort The database port. */
    public static string $dbPort = '';

    /** @var string $dbName The database name. */
    public static string $dbDatabaseName = '';

    /** @var string $dbUsername The database username. */
    public static string $dbUsername = '';

    /** @var string $dbPassword The database password. */
    public static string $dbPassword = '';

    /** @var string $baseUrl The base URL of the application. */
    public static string $baseUrl = '/';

    /** @var string $mailRecipient The mail recipient. */
    public static string $mailRecipient = '';
    public static string $mailEndpoint = '';
    public static string $mailApiKey = '';
    public static string $healthApiEndpoint = '';

    /**
     * Retrieves the allowed CORS origins.
     *
     * @return array An array of allowed CORS origins.
     */
    public static function getAllowedOrigins(): array
    {
        return self::$allowedOrigins;
    }

    /**
     * Retrieves the API keys.
     *
     * @return array An array of API keys.
     */
    public static function getApiKeys(): array
    {
        return self::$apiKeys;
    }

    /**
     * Load configuration from external sources synchronously
     * For example, loading from environment variables or configuration files
     * This method should populate the configuration variables
     */
    public static function loadConfig(bool $isProd = false): void
    {
        $envName = '.env.dev';
        if ($isProd) {
            $envName = '.env.prod';
        }

        $dotenv = Dotenv\Dotenv::createImmutable(__DIR__, $envName);
        $dotenv->load();

        self::$allowedOrigins = explode(',', $_ENV['ALLOWED_ORIGINS']);
        self::$apiKeys = [
            'fe_key' => $_ENV['API_KEY_FE'],
            'be_key' => $_ENV['API_KEY_BE']
        ];
        self::$dbHost = $_ENV['DB_HOST'];
        self::$dbPort = $_ENV['DB_PORT'];
        self::$dbDatabaseName = $_ENV['DB_DATABASE_NAME'];
        self::$dbUsername = $_ENV['DB_USERNAME'];
        self::$dbPassword = $_ENV['DB_PASSWORD'];
        self::$mailRecipient = $_ENV['MAIL_RECIPIENT'];
        self::$mailEndpoint = $_ENV['MAIL_ENDPOINT'];
        self::$mailApiKey = $_ENV['MAIL_API_KEY'];
        self::$healthApiEndpoint = $_ENV['HEALTH_ENDPOINT'];
    }
}

// loadConfig on start
Config::loadConfig(false);
