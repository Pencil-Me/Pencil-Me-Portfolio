<?php

namespace Inc;

use Dotenv;

/**
 * Application configuration loaded from .env.dev / .env.prod.
 */
class Config
{
    /** @var array<int, string> */
    public static array $allowedOrigins = [];

    /** @var array<string, string> */
    public static array $apiKeys = [];

    public static string $mailHost = '';

    public static string $mailPort = '';

    public static string $mailUsername = '';

    public static string $mailPassword = '';

    public static string $mailSender = '';

    public static string $mailFromName = '';

    /** @var 'tls'|'ssl'|'' */
    public static string $mailSmtpSecure = 'tls';

    /**
     * @return array<int, string>
     */
    public static function getAllowedOrigins(): array
    {
        return self::$allowedOrigins;
    }

    /**
     * @return array<string, string>
     */
    public static function getApiKeys(): array
    {
        return self::$apiKeys;
    }

    public static function loadConfig(bool $isProd = false): void
    {
        $envName = $isProd ? '.env.prod' : '.env.dev';

        $dotenv = Dotenv\Dotenv::createImmutable(__DIR__, $envName);
        $dotenv->load();

        self::$allowedOrigins = explode(',', $_ENV['ALLOWED_ORIGINS']);
        self::$apiKeys = [
            'fe_key' => $_ENV['API_KEY_FE'],
            'be_key' => $_ENV['API_KEY_BE'],
        ];
        self::$mailHost = $_ENV['MAIL_HOST'];
        self::$mailPort = $_ENV['MAIL_PORT'];
        self::$mailUsername = $_ENV['MAIL_USERNAME'];
        self::$mailPassword = $_ENV['MAIL_PASSWORD'];
        self::$mailSender = $_ENV['MAIL_SENDER'] ?? $_ENV['MAIL_USERNAME'];
        self::$mailFromName = $_ENV['MAIL_FROM_NAME'] ?? '';
        self::$mailSmtpSecure = strtolower((string) ($_ENV['MAIL_SMTP_SECURE'] ?? 'tls'));
    }

    public static function isProductionEnvironment(): bool
    {
        $appEnv = getenv('APP_ENV');
        if ($appEnv === false) {
            $appEnv = $_ENV['APP_ENV'] ?? $_SERVER['APP_ENV'] ?? 'development';
        }

        return $appEnv === 'production';
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
