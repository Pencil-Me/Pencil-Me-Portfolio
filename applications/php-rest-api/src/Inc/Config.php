<?php

namespace Inc;

/**
 * Holds the configuration information of our application.
 */
class Config
{
    /** @var array $allowedOrigins An array of allowed CORS origins. */
    public static array $allowedOrigins = [];

    /** @var array $apiKeys An array of API keys. */
    public static array $apiKeys = [];

    public static string $dbHost = '';
    public static string $dbPort = '';
    public static string $dbDatabaseName = '';
    public static string $dbUsername = '';
    public static string $dbPassword = '';
    public static string $baseUrl = '/';
    public static string $mailRecipient = '';
    public static string $mailEndpoint = '';
    public static string $mailApiKey = '';
    public static string $healthApiEndpoint = '';

    public static function getAllowedOrigins(): array
    {
        return self::$allowedOrigins;
    }

    public static function getApiKeys(): array
    {
        return self::$apiKeys;
    }

    public static function loadConfig(bool $isProd = false): void
    {
        $envName = $isProd ? '.env.prod' : '.env.dev';
        $vars = EnvLoader::load(__DIR__, $envName);

        self::$allowedOrigins = self::parseAllowedOrigins($vars['ALLOWED_ORIGINS'] ?? '');
        self::$apiKeys = [
            'fe_key' => $vars['API_KEY_FE'] ?? '',
            'be_key' => $vars['API_KEY_BE'] ?? '',
        ];
        self::$dbHost = $vars['DB_HOST'] ?? '';
        self::$dbPort = $vars['DB_PORT'] ?? '';
        self::$dbDatabaseName = $vars['DB_DATABASE_NAME'] ?? '';
        self::$dbUsername = $vars['DB_USERNAME'] ?? '';
        self::$dbPassword = $vars['DB_PASSWORD'] ?? '';
        self::$mailRecipient = $vars['MAIL_RECIPIENT'] ?? '';
        self::$mailEndpoint = $vars['MAIL_ENDPOINT'] ?? '';
        self::$mailApiKey = $vars['MAIL_API_KEY'] ?? '';
        self::$healthApiEndpoint = $vars['HEALTH_ENDPOINT'] ?? '';
    }

    public static function isProductionEnvironment(): bool
    {
        $appEnv = getenv('APP_ENV');
        if ($appEnv === false || $appEnv === '') {
            $appEnv = $_SERVER['APP_ENV'] ?? $_ENV['APP_ENV'] ?? null;
        }

        if ($appEnv !== null && $appEnv !== '') {
            return strtolower((string) $appEnv) === 'production';
        }

        $resolved = EnvLoader::resolveEnvFilePath(__DIR__);

        return $resolved !== null && str_ends_with($resolved, '.env.prod');
    }

    /**
     * @return list<string>
     */
    public static function parseAllowedOrigins(string $value): array
    {
        return EnvLoader::parseAllowedOriginsValue($value);
    }

    public static function getLogLevel(): string
    {
        $configured = getenv('LOG_LEVEL');
        if ($configured === false) {
            $configured = $_ENV['LOG_LEVEL'] ?? null;
        }

        if ($configured === null || $configured === '') {
            return self::isProductionEnvironment() ? 'INFO' : 'DEBUG';
        }

        return strtoupper((string) $configured);
    }
}
