<?php

namespace Inc;

// Register the autoloader for classes
spl_autoload_register(function ($class) {
    // Define the base directory for classes
    $baseDir = PROJECT_ROOT_PATH;

    // Replace the namespace separator with the directory separator
    $classFilePath = str_replace('\\', '/', $class);

    // Construct the file path based on the namespace and the base directory
    $filePath = $baseDir . $classFilePath . '.php';

    // Check if the file exists and require it if found
    if (file_exists($filePath)) {
        require_once $filePath;
    }
});

/**
 * The Router class is responsible for handling HTTP requests and routing to the appropriate controllers and methods.
 */
class Router {
    /**
     * This method performs routing based on the provided method and path.
     *
     * @param string $method The HTTP method of the request (e.g., GET, POST).
     * @param string $path The path of the request (e.g., /all_projects).
     * @param string $api_key The API key for authentication.
     * @param array $routes A list of routes mapped to controllers and methods.
     * @param array $protectedRoutes A list of protected routes requiring authentication.
     */
    public static function route(string $method, string $path, string $api_key, array $routes, array $protectedRoutes) {
        $matchedRoute = self::matchRoute($path, $routes);
        if ($matchedRoute !== null && isset($matchedRoute['handlers'][$method])) {
            $route = $matchedRoute['handlers'][$method];
            $routePattern = $matchedRoute['pattern'];
            $controllerName = $route['controller'];
            $methodName = $route['method'];

            if (self::isRouteProtected($routePattern, $method, $protectedRoutes)) {
                $required_key = $protectedRoutes[$routePattern]['required_key'];
                if (!self::isAuthenticated($api_key, $required_key)) {
                    self::unauthorized();
                }
            }

            self::executeRoute($controllerName, $methodName);
        }
        self::routeNotFound();
    }

    /**
     * Checks if the specified route expects an ID parameter.
     *
     * @param string $controllerName The name of the controller.
     * @param string $methodName The name of the method in the controller.
     * @return bool Returns true if the route expects an ID parameter, otherwise false.
     */
    private static function routeExpectsId(string $controllerName, string $methodName): bool {
        $reflectionMethod = new \ReflectionMethod($controllerName, $methodName);
        $parameters = $reflectionMethod->getParameters();

        if (!empty($parameters)) {
            foreach ($parameters as $parameter) {
                if ($parameter->getName() === 'id') {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Matches the requested path against defined routes.
     *
     * @param string $path The requested path.
     * @param array $routes A list of defined routes.
     * @return array|null Returns matched route metadata if found, otherwise null.
     */
    private static function matchRoute(string $path, array $routes): ?array {
        foreach ($routes as $route => $routeData) {
            $pattern = str_replace('/', '\/', $route);
            $pattern = '/^' . str_replace('(\w+)',  '([\w-]+)', $pattern) . '$/';

            $matches = [];

            if (preg_match($pattern, $path, $matches)) {
                if (isset($matches[1])) {
                    $_GET['id'] = $matches[1];
                }
                return [
                    'pattern' => $route,
                    'handlers' => $routeData,
                ];
            }
        }
        return null;
    }

    /**
     * Executes the specified route by instantiating the corresponding controller and calling the method.
     *
     * @param string $controllerName The name of the controller.
     * @param string $methodName The name of the method in the controller.
     */
    private static function executeRoute(string $controllerName, string $methodName) {
        if (class_exists($controllerName)) {
            $controller = new $controllerName();

            if (method_exists($controller, $methodName)) {
                if (self::routeExpectsId($controllerName, $methodName)) {
                    $controller->$methodName($_GET['id']);
                    exit();
                }
                $controller->$methodName();
                exit();
            }
        }
        self::controllerNotFound();
    }

    /**
     * Checks if the specified route pattern is protected and requires authentication.
     *
     * @param string $routePattern The matched route pattern.
     * @param string $method The HTTP method of the request.
     * @param array $protectedRoutes A list of protected routes.
     * @return bool Returns true if the route is protected, otherwise false.
     */
    private static function isRouteProtected(string $routePattern, string $method, array $protectedRoutes): bool {
        return isset($protectedRoutes[$routePattern][$method]);
    }

    /**
     * Checks if the user is authenticated.
     *
     * @param string $api_key The API key provided by the user.
     * @param string $required_key The required API key identifier for the protected route.
     * @return bool Returns true if the user is authenticated, otherwise false.
     */
    private static function isAuthenticated(string $api_key, string $required_key): bool {
        if ($api_key === '' || !isset(Config::getApiKeys()[$required_key])) {
            return false;
        }

        return hash_equals(
            (string) Config::getApiKeys()[$required_key],
            (string) $api_key
        );
    }

    /**
     * Outputs an error if the requested route is not found.
     */
    private static function routeNotFound() {
        http_response_code(404);
        echo json_encode(['message' => 'Requested Route Not Found']);
        exit;
    }

    /**
     * Outputs an error if the controller or method is not found.
     */
    private static function controllerNotFound() {
        http_response_code(404);
        echo json_encode(['message' => 'Controller or Method Not Found']);
        exit;
    }

    /**
     * Outputs an error if the user is not authenticated.
     */
    private static function unauthorized() {
        http_response_code(401);
        echo json_encode(['message' => 'Unauthorized']);
        exit;
    }
}
