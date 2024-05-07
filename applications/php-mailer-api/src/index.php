<?php

/**
 * The entry-point of our application. It acts as a front-controller.
 */

use Inc\Router;

// Include the autoloader
require 'vendor/autoload.php';

// Include the Bootstrap file
require __DIR__ . "/Inc/Bootstrap.php";

// Define routes and protected routes
$routes = [
    '/send_email' => ['POST' => ['controller' => 'Controller\Api\MailController', 'method' => 'sendEmail']],
    '/healthcheck' => ['GET' => ['controller' => 'Controller\Api\HealthController', 'method' => 'getHealthcheck']],
];
$protectedRoutes = [
    '/send_email' => ['POST' => true, 'required_key' => 'fe_key'],
];

try {
    // Get request method, path, and API key
    $method = $_SERVER['REQUEST_METHOD'] ?? null;
    $path = str_replace('/index.php', '', $_SERVER['REQUEST_URI']);
    $api_key = $_SERVER['HTTP_API_KEY'] ?? '';

    // Check if method and path are defined
    if ($method == null || $path == null)
    {
        throw new Exception('Required fields are undefined.');
    }

    // Route the request
    Router::route($method, $path, $api_key, $routes, $protectedRoutes);
} catch (Exception $e) {
    // Handle exceptions
    http_response_code(500);
    echo json_encode(['message' => 'Internal Server Error: ' . $e->getMessage()]);
}
