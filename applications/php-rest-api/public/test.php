<?php

declare(strict_types=1);

/**
 * API-Diagnose (Shared Hosting).
 *
 *   curl.exe -s "https://api.example.eu/test.php"
 *   curl.exe -s "https://api.example.eu/test.php?format=json"
 *   curl.exe -s -H "Origin: https://pencil-me.de" -H "Referer: https://pencil-me.de/" "https://api.example.eu/test.php?format=json"
 *
 * Nach Analyse vom Server loeschen.
 */

$apiRoot = is_dir(__DIR__ . '/src') ? __DIR__ : dirname(__DIR__);
$incDir = $apiRoot . '/src/Inc';

require_once $incDir . '/EnvLoader.php';
require_once $incDir . '/Diag.php';

Inc\Diag::respond($apiRoot, $incDir);
