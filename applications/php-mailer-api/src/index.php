<?php

/**
 * The entry-point of our application. It acts as a front-controller.
 */

use Inc\AppLogger;
use Inc\RequestPath;
use Inc\Router;

require dirname(__DIR__) . '/vendor/autoload.php';
require __DIR__ . '/Inc/Bootstrap.php';

$routes = [
    '/send_email' => ['POST' => ['controller' => 'Controller\Api\MailController', 'method' => 'sendEmail']],
    '/healthcheck' => ['GET' => ['controller' => 'Controller\Api\HealthController', 'method' => 'getHealthcheck']],
];
$protectedRoutes = [
    '/send_email' => ['POST' => true, 'required_key' => 'fe_key'],
];

try {
    $method = $_SERVER['REQUEST_METHOD'] ?? null;
    $path = RequestPath::parse($_SERVER['REQUEST_URI']);
    $api_key = $_SERVER['HTTP_API_KEY'] ?? '';

    if ($method === null || $path === null) {
        throw new Exception('Required fields are undefined.');
    }

    Router::route($method, $path, $api_key, $routes, $protectedRoutes);
} catch (Exception $e) {
    AppLogger::error('Mailer front controller error', [
        'exception' => $e->getMessage(),
        'route' => $_SERVER['REQUEST_URI'] ?? '',
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    ]);
    http_response_code(500);
    echo json_encode(['message' => 'An unexpected error occurred. Please try again later.']);
}
