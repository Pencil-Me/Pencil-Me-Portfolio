<?php

namespace Inc;

/**
 * Laedt .env.dev / .env.prod ohne vlucas/phpdotenv (weniger Deploy-Dateien).
 */
final class EnvLoader
{
    /**
     * Production: .env.prod hat Vorrang wenn vorhanden (auch wenn .env.dev noch auf dem Server liegt).
     */
    public static function resolveEnvFilePath(string $incDir): ?string
    {
        $prod = $incDir . '/.env.prod';
        $dev = $incDir . '/.env.dev';

        if (is_file($prod)) {
            return $prod;
        }

        if (is_file($dev)) {
            return $dev;
        }

        return null;
    }

    /**
     * @return list<string>
     */
    public static function parseAllowedOriginsFromFile(string $envFile): array
    {
        if (!is_readable($envFile)) {
            return [];
        }

        foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
            $line = self::normalizeLine($line);
            if ($line === '' || str_starts_with($line, '#')) {
                continue;
            }
            if (!str_starts_with($line, 'ALLOWED_ORIGINS=')) {
                continue;
            }

            return self::parseAllowedOriginsValue(substr($line, strlen('ALLOWED_ORIGINS=')));
        }

        return [];
    }

    /**
     * @return list<string>
     */
    public static function parseAllowedOriginsValue(string $value): array
    {
        return array_values(array_filter(
            array_map('trim', explode(',', $value)),
            static fn (string $origin): bool => $origin !== ''
        ));
    }

    /**
     * @return array<string, string>
     */
    public static function load(string $directory, string $fileName): array
    {
        $path = rtrim($directory, '/\\') . DIRECTORY_SEPARATOR . $fileName;
        if (!is_readable($path)) {
            throw new \RuntimeException("Env-Datei nicht lesbar: $path");
        }

        $vars = [];
        foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
            $line = self::normalizeLine($line);
            if ($line === '' || str_starts_with($line, '#')) {
                continue;
            }
            $idx = strpos($line, '=');
            if ($idx === false || $idx < 1) {
                continue;
            }
            $key = trim(substr($line, 0, $idx));
            $value = trim(substr($line, $idx + 1));
            if ($value !== '' && $value[0] === '"' && str_ends_with($value, '"')) {
                $value = substr($value, 1, -1);
            }
            $vars[$key] = $value;
            $_ENV[$key] = $value;
            putenv("$key=$value");
        }

        return $vars;
    }

    private static function normalizeLine(string $line): string
    {
        $line = trim($line);

        return preg_replace('/^\xEF\xBB\xBF/', '', $line) ?? $line;
    }
}
