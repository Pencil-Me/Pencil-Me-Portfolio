<?php

namespace Inc;

/**
 * API-Diagnose (Shared Hosting) — aufgerufen von public/test.php.
 */
final class Diag
{
    public static function respond(string $apiRoot, string $incDir): void
    {
        $asJson = isset($_GET['format']) && strtolower((string) $_GET['format']) === 'json';
        $report = self::buildReport($apiRoot, $incDir);

        if ($asJson) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
            return;
        }

        header('Content-Type: text/plain; charset=utf-8');
        echo 'Pencil-Me REST API — Diagnose (test.php)' . PHP_EOL;
        echo str_repeat('=', 50) . PHP_EOL;
        echo 'UTC: ' . $report['generated_at_utc'] . PHP_EOL;
        echo $report['warning'] . PHP_EOL . PHP_EOL;

        foreach (['php', 'paths', 'files', 'request', 'cors', 'api_key', 'routing', 'env'] as $section) {
            echo '[' . strtoupper($section) . ']' . PHP_EOL;
            self::printSection($report[$section] ?? []);
            echo PHP_EOL;
        }

        echo '[HEADERS]' . PHP_EOL;
        foreach ($report['headers'] as $k => $v) {
            echo "  $k=$v" . PHP_EOL;
        }
    }

    /**
     * @param array<string, mixed> $data
     */
    private static function printSection(array $data, int $indent = 1): void
    {
        $pad = str_repeat(' ', $indent * 2);
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                echo $pad . $key . ':' . PHP_EOL;
                self::printSection($value, $indent + 1);
                continue;
            }
            if (is_bool($value)) {
                $value = $value ? 'yes' : 'NO';
            }
            echo $pad . $key . '=' . ($value ?? '(null)') . PHP_EOL;
        }
    }

    /**
     * @return array<string, mixed>
     */
    private static function buildReport(string $apiRoot, string $incDir): array
    {
        $envFile = EnvLoader::resolveEnvFilePath($incDir);
        $allowed = $envFile !== null ? EnvLoader::parseAllowedOriginsFromFile($envFile) : [];
        $resolvedOrigin = self::resolveOrigin();
        $originAllowed = $resolvedOrigin !== null && self::isOriginAllowed($resolvedOrigin, $allowed);

        $corsApply = ['response_headers' => []];
        if (is_file($incDir . '/CorsHeaders.php')) {
            require_once $incDir . '/CorsHeaders.php';
            CorsHeaders::bootstrapFromEnvDir($incDir);
            CorsHeaders::apply();
            $corsApply['response_headers'] = headers_list();
        }

        $routing = ['request_path' => null, 'api_key' => null];
        $autoload = $apiRoot . '/vendor/autoload.php';
        if (is_file($autoload)) {
            require_once $autoload;
            if (class_exists(RequestPath::class)) {
                $routing['request_path'] = RequestPath::parse($_SERVER['REQUEST_URI'] ?? '');
            }
            if (class_exists(ApiKeyResolver::class)) {
                $key = ApiKeyResolver::resolve();
                $routing['api_key'] = $key === '' ? null : self::maskSecret($key);
            }
        }

        $host = $_SERVER['HTTP_HOST'] ?? 'api.example.eu';

        return [
            'generated_at_utc' => gmdate('Y-m-d\TH:i:s\Z'),
            'warning' => 'Diagnose-Endpunkt — nach Analyse deaktivieren oder entfernen.',
            'php' => [
                'version' => PHP_VERSION,
                'sapi' => PHP_SAPI,
                'deploy_file_estimate' => 'vendor ~11 Dateien + src (~20) + index.php + .htaccess',
            ],
            'paths' => [
                'api_root' => $apiRoot,
                'inc_dir' => $incDir,
                'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? null,
            ],
            'files' => [
                'index.php' => is_file($apiRoot . '/index.php'),
                'htaccess' => is_file($apiRoot . '/.htaccess'),
                'CorsHeaders.php' => is_file($incDir . '/CorsHeaders.php'),
                '.env.prod' => is_file($incDir . '/.env.prod'),
                '.env.dev' => is_file($incDir . '/.env.dev'),
                'env_file_used' => $envFile !== null ? basename($envFile) : null,
                'vendor_autoload' => is_file($autoload),
            ],
            'request' => [
                'method' => $_SERVER['REQUEST_METHOD'] ?? null,
                'request_uri' => $_SERVER['REQUEST_URI'] ?? null,
            ],
            'headers' => self::collectHeaders(),
            'cors' => [
                'allowed_origins' => $allowed,
                'resolved_origin' => $resolvedOrigin,
                'origin_allowed' => $originAllowed,
                'would_set' => $originAllowed && $resolvedOrigin
                    ? 'Access-Control-Allow-Origin: ' . $resolvedOrigin
                    : null,
                'apply_headers' => $corsApply,
            ],
            'api_key' => [
                'query' => self::maskSecret(is_string($_GET['api_key'] ?? null) ? $_GET['api_key'] : null),
                'header' => self::maskSecret(is_string($_SERVER['HTTP_API_KEY'] ?? null) ? $_SERVER['HTTP_API_KEY'] : null),
            ],
            'routing' => $routing,
            'env' => self::envSummary($envFile),
            'curl_hints' => [
                'json' => "curl.exe -s \"https://$host/test.php?format=json\"",
                'origin' => "curl.exe -s -I -H \"Origin: https://pencil-me.de\" -H \"Referer: https://pencil-me.de/\" \"https://$host/test.php\"",
                'api' => "curl.exe -s -I -H \"Origin: https://pencil-me.de\" \"https://$host/index.php/all_projects?api_key=...\"",
            ],
        ];
    }

    private static function maskSecret(?string $value): ?string
    {
        if ($value === null || $value === '') {
            return $value;
        }
        $len = strlen($value);

        return $len <= 4 ? '****' : substr($value, 0, 4) . '****';
    }

    /**
     * @return array<string, string>
     */
    private static function collectHeaders(): array
    {
        $out = [];
        foreach ($_SERVER as $key => $value) {
            if (is_string($value) && str_starts_with($key, 'HTTP_')) {
                $out[$key] = $value;
            }
        }
        if (function_exists('getallheaders')) {
            foreach (getallheaders() ?: [] as $name => $value) {
                if (is_string($name) && is_string($value)) {
                    $out['getallheaders:' . $name] = $value;
                }
            }
        }
        ksort($out);

        return $out;
    }

    private static function resolveOrigin(): ?string
    {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? null;
        if (is_string($origin) && $origin !== '') {
            return $origin;
        }

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

    /**
     * @param list<string> $allowed
     */
    private static function isOriginAllowed(string $origin, array $allowed): bool
    {
        $origin = rtrim($origin, '/');
        foreach ($allowed as $entry) {
            $entry = rtrim($entry, '/');
            if ($entry === $origin) {
                return true;
            }
            $pa = parse_url($origin);
            $pb = parse_url($entry);
            if (!is_array($pa) || !is_array($pb) || !isset($pa['host'], $pb['host'])) {
                continue;
            }
            if (($pa['scheme'] ?? '') !== ($pb['scheme'] ?? '')) {
                continue;
            }
            $ha = preg_replace('/^www\./i', '', (string) $pa['host']);
            $hb = preg_replace('/^www\./i', '', (string) $pb['host']);
            if ($ha === $hb) {
                return true;
            }
        }

        return false;
    }

    /**
     * @return array<string, mixed>
     */
    /**
     * @return array<string, mixed>
     */
    private static function envSummary(?string $file): array
    {
        if ($file === null || !is_readable($file)) {
            return ['file' => null, 'vars' => []];
        }
        $vars = [];
        foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
                continue;
            }
            [$key, $value] = explode('=', $line, 2);
            if (preg_match('/(KEY|PASSWORD|SECRET)/i', $key)) {
                $value = (string) self::maskSecret($value);
            }
            $vars[$key] = $value;
        }

        return ['file' => basename($file), 'vars' => $vars];
    }
}
