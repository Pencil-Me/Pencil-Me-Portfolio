<?php

/**
 * The entry-point of our application. It acts as a front-controller.
 */

use Inc\Router;
use Inc\Bootstrap;

// Include the autoloader
require __DIR__ . '/../vendor/autoload.php';

// Include the Bootstrap file
require __DIR__ . '/../src/Inc/Bootstrap.php';

// Check if the request is directly to index.php
if ($_SERVER['REQUEST_URI'] === '/index.php' || $_SERVER['REQUEST_URI'] === '/') {
    echo "Welcome to the API!";
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
    // Get request method, path, and API key
    $method = $_SERVER['REQUEST_METHOD'] ?? null;
    $path = parseRequestPath($_SERVER['REQUEST_URI']);
    $api_key = $_SERVER['HTTP_API_KEY'] ?? '';

    // Check if method and path are defined
    if ($method == null || $path == null) {
        throw new Exception('Required fields are undefined.');
    }

    // Route the request
    Router::route($method, $path, $api_key, $routes, $protectedRoutes);
} catch (Exception $e) {
    // Log the detailed error message internally
    logError($e);

    // Send a generic error message to the client
    http_response_code(500);
    echo json_encode(['message' => 'An unexpected error occurred. Please try again later.']);
}

// Function to parse and sanitize the request path
function parseRequestPath($uri) {
    $path = str_replace('/index.php', '', $uri);
    return filter_var($path, FILTER_SANITIZE_URL);
}

// Function to log errors
function logError($exception) {
    // Log the error using Monolog
    Bootstrap::$logger->error($exception->getMessage(), ['exception' => $exception]);
}
