<?php

namespace Inc;

/**
 * CORS Allow-Origin fuer Cross-Origin-Reads (ohne OPTIONS-Preflight).
 * Shared Hosting: HTTP_ORIGIN erreicht PHP oft nicht — Referer-Fallback.
 */
final class CorsHeaders
{
    /** @var list<string> */
    private static array $allowedOrigins = [];

    /**
     * Frueh aus .env.prod/.env.dev (vor Composer).
     */
    public static function bootstrapFromEnvDir(string $incDir): void
    {
        if (self::$allowedOrigins !== []) {
            return;
        }

        $envFile = EnvLoader::resolveEnvFilePath($incDir);
        if ($envFile === null || !is_readable($envFile)) {
            return;
        }

        self::$allowedOrigins = EnvLoader::parseAllowedOriginsFromFile($envFile);
        self::apply();
    }

    public static function getResolvedEnvFile(string $incDir): ?string
    {
        return EnvLoader::resolveEnvFilePath($incDir);
    }

    /**
     * Nach Config::loadConfig (falls Env-Datei frueh nicht lesbar war).
     */
    public static function bootstrapFromConfig(): void
    {
        if (self::$allowedOrigins !== []) {
            return;
        }

        if (!class_exists(Config::class)) {
            return;
        }

        $fromConfig = Config::getAllowedOrigins();
        if ($fromConfig !== []) {
            self::$allowedOrigins = $fromConfig;
            self::apply();
        }
    }

    /**
     * Vor jeder JSON-Antwort erneut setzen (Header koennen unterwegs verloren gehen).
     */
    public static function apply(): void
    {
        if (self::$allowedOrigins === []) {
            return;
        }

        $origin = self::resolveRequestOrigin();
        if ($origin === null || $origin === '') {
            return;
        }

        if (!self::isOriginAllowed($origin)) {
            return;
        }

        if (headers_sent()) {
            return;
        }

        header("Access-Control-Allow-Origin: $origin");
        header('Vary: Origin');
    }

    /**
     * Expliziter Origin-Header, aber nicht erlaubt -> 403 (nur wenn wirklich Origin gesendet).
     */
    public static function rejectDisallowedExplicitOrigin(): void
    {
        if (self::$allowedOrigins === []) {
            return;
        }

        $explicit = self::resolveExplicitOriginHeader();
        if ($explicit === null || $explicit === '') {
            return;
        }

        if (!self::isOriginAllowed($explicit)) {
            http_response_code(403);
            exit;
        }
    }

    /**
     * @return list<string>
     */
    public static function getAllowedOrigins(): array
    {
        return self::$allowedOrigins;
    }

    private static function isOriginAllowed(string $origin): bool
    {
        $origin = self::normalizeOrigin($origin);

        foreach (self::$allowedOrigins as $allowed) {
            if (self::normalizeOrigin($allowed) === $origin) {
                return true;
            }
            if (self::areEquivalentHosts($origin, self::normalizeOrigin($allowed))) {
                return true;
            }
        }

        return false;
    }

    private static function normalizeOrigin(string $origin): string
    {
        return rtrim(trim($origin), '/');
    }

    private static function areEquivalentHosts(string $a, string $b): bool
    {
        $pa = parse_url($a);
        $pb = parse_url($b);
        if (!is_array($pa) || !is_array($pb) || !isset($pa['host'], $pb['host'])) {
            return false;
        }
        if (($pa['scheme'] ?? '') !== ($pb['scheme'] ?? '')) {
            return false;
        }

        $ha = preg_replace('/^www\./i', '', (string) $pa['host']);
        $hb = preg_replace('/^www\./i', '', (string) $pb['host']);

        return $ha === $hb && ($pa['port'] ?? null) === ($pb['port'] ?? null);
    }

    private static function resolveRequestOrigin(): ?string
    {
        $explicit = self::resolveExplicitOriginHeader();
        if ($explicit !== null && $explicit !== '') {
            return $explicit;
        }

        return self::originFromReferer();
    }

    private static function resolveExplicitOriginHeader(): ?string
    {
        $origin = $_SERVER['PM_CORS_ORIGIN']
            ?? $_SERVER['HTTP_ORIGIN']
            ?? $_SERVER['REDIRECT_HTTP_ORIGIN']
            ?? null;
        if (is_string($origin) && $origin !== '') {
            return $origin;
        }

        if (!function_exists('getallheaders')) {
            return null;
        }

        $headers = getallheaders();
        if (!is_array($headers)) {
            return null;
        }

        foreach ($headers as $name => $value) {
            if (strtolower((string) $name) === 'origin' && is_string($value) && $value !== '') {
                return $value;
            }
        }

        return null;
    }

    private static function originFromReferer(): ?string
    {
        $referer = $_SERVER['HTTP_REFERER'] ?? '';
        if (!is_string($referer) || $referer === '') {
            return null;
        }

        $parts = parse_url($referer);
        if (!is_array($parts) || !isset($parts['scheme'], $parts['host'])) {
            return null;
        }

        $port = isset($parts['port']) ? ':' . $parts['port'] : '';

        return $parts['scheme'] . '://' . $parts['host'] . $port;
    }

}
