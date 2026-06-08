<?php

/**
 * The entry-point of our application. It acts as a front-controller.
 */

use Inc\ApiKeyResolver;
use Inc\Router;
use Inc\Bootstrap;
use Inc\CorsHeaders;
use Inc\RequestPath;
use Inc\EarlyCors;

// Shared hosting: index.php im API-Root (src/ daneben). Docker: public/index.php (../src).
$apiRoot = is_dir(__DIR__ . '/src') ? __DIR__ : dirname(__DIR__);
$incDir = $apiRoot . '/src/Inc';

$corsHeadersFile = $incDir . '/CorsHeaders.php';
$earlyCorsFile = $incDir . '/EarlyCors.php';
if (is_file($incDir . '/EnvLoader.php')) {
    require_once $incDir . '/EnvLoader.php';
}
if (is_file($corsHeadersFile)) {
    require_once $corsHeadersFile;
    CorsHeaders::bootstrapFromEnvDir($incDir);
    CorsHeaders::rejectDisallowedExplicitOrigin();
} elseif (is_file($earlyCorsFile)) {
    require_once $earlyCorsFile;
    EarlyCors::handle($incDir);
}

require $apiRoot . '/vendor/autoload.php';
require $incDir . '/Bootstrap.php';

// Check if the request is directly to index.php
if ($_SERVER['REQUEST_URI'] === '/index.php' || $_SERVER['REQUEST_URI'] === '/') {
    $appEnv = getenv('APP_ENV') ?: ($_ENV['APP_ENV'] ?? $_SERVER['APP_ENV'] ?? 'development');
    if ($appEnv !== 'production') {
        echo "Welcome to the API!";
    } else {
        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode(['message' => 'Not Found']);
    }
    exit;
}

// Define routes and protected routes
$routes = [
    '/all_projects' => ['GET' => ['controller' => 'Controller\Api\ProjectsController', 'method' => 'getAllFe']],
    '/all_techstacks' => ['GET' => ['controller' => 'Controller\Api\TechstackController', 'method' => 'getAllFe']],
    '/all_customers' => ['GET' => ['controller' => 'Controller\Api\CustomersController', 'method' => 'getAllFe']],
    '/get_project/(\w+)' => ['GET' => ['controller' => 'Controller\Api\ProjectsController', 'method' => 'getProjectFe']],
    '/send_email' => ['POST' => ['controller' => 'Controller\Api\MailController', 'method' => 'sendEmail']],
    '/healthcheck' => ['GET' => ['controller' => 'Controller\Api\HealthController', 'method' => 'getHealthcheck']],
];
$protectedRoutes = [
    '/all_projects' => ['GET' => true, 'required_key' => 'fe_key'],
    '/all_techstacks' => ['GET' => true, 'required_key' => 'fe_key'],
    '/all_customers' => ['GET' => true, 'required_key' => 'fe_key'],
    '/send_email' => ['POST' => true, 'required_key' => 'fe_key'],
    '/get_project/(\w+)' => ['GET' => true, 'required_key' => 'fe_key'],
];

try {
    $method = $_SERVER['REQUEST_METHOD'] ?? null;
    $path = RequestPath::parse($_SERVER['REQUEST_URI']);
    $api_key = ApiKeyResolver::resolve();

    if ($method === null || $path === null) {
        throw new Exception('Required fields are undefined.');
    }

    Router::route($method, $path, $api_key, $routes, $protectedRoutes);
} catch (Exception $e) {
    Bootstrap::$logger->error($e->getMessage(), [
        'exception' => $e,
        'route' => $_SERVER['REQUEST_URI'] ?? '',
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    ]);

    CorsHeaders::apply();
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['message' => 'An unexpected error occurred. Please try again later.']);
}
