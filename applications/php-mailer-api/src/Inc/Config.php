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

    /** @var string $mailHost The database host. */
    public static string $mailHost = '';

    /** @var string $mailPort The database port. */
    public static string $mailPort = '';

    /** @var string $mailUsername The database username. */
    public static string $mailUsername = '';

    /** @var string $mailPassword The database password. */
    public static string $mailPassword = '';

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
        self::$mailHost = $_ENV['MAIL_HOST'];
        self::$mailPort = $_ENV['MAIL_PORT'];
        self::$mailUsername = $_ENV['MAIL_USERNAME'];
        self::$mailPassword = $_ENV['MAIL_PASSWORD'];
    }
}

// loadConfig on start
Config::loadConfig(false);
