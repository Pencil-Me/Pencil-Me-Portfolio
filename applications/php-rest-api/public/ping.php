<?php

declare(strict_types=1);

/**
 * Kurzcheck: PHP, Pfade, kritische Dateien.
 *   curl.exe -s "https://api.example.eu/ping.php"
 * Nach Analyse vom Server loeschen.
 */
header('Content-Type: text/plain; charset=utf-8');

$apiRoot = is_dir(__DIR__ . '/src') ? __DIR__ : dirname(__DIR__);
$incDir = $apiRoot . '/src/Inc';

echo 'OK PHP ' . PHP_VERSION . PHP_EOL;
echo 'api_root=' . $apiRoot . PHP_EOL;
echo 'inc_dir=' . $incDir . ' ' . (is_dir($incDir) ? 'yes' : 'NO') . PHP_EOL;
echo 'CorsHeaders.php ' . (is_file($incDir . '/CorsHeaders.php') ? 'yes' : 'NO') . PHP_EOL;
echo '.env.prod ' . (is_file($incDir . '/.env.prod') ? 'yes' : 'NO') . PHP_EOL;
echo '.env.dev ' . (is_file($incDir . '/.env.dev') ? 'yes (sollte in Production fehlen)' : 'no') . PHP_EOL;
require_once $incDir . '/EnvLoader.php';
$envUsed = Inc\EnvLoader::resolveEnvFilePath($incDir);
echo 'env_file_used=' . ($envUsed ? basename($envUsed) : 'NONE') . PHP_EOL;
echo 'vendor/autoload.php ' . (is_file($apiRoot . '/vendor/autoload.php') ? 'yes' : 'NO') . PHP_EOL;
echo 'index.php ' . (is_file($apiRoot . '/index.php') ? 'yes' : 'NO') . PHP_EOL;
echo 'htaccess ' . (is_file($apiRoot . '/.htaccess') ? 'yes' : 'no') . PHP_EOL;
echo 'HTTP_ORIGIN=' . ($_SERVER['HTTP_ORIGIN'] ?? '(leer)') . PHP_EOL;
echo 'HTTP_REFERER=' . ($_SERVER['HTTP_REFERER'] ?? '(leer)') . PHP_EOL;
echo 'Vollstaendige Diagnose: test.php' . PHP_EOL;
