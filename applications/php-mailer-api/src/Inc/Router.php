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
        // First, check if the path matches any known pattern
        $matchedRoute = self::matchRoute($path, $routes);
        if ($matchedRoute !== null && isset($matchedRoute[$method])) {
            $route = $matchedRoute[$method];
            $controllerName = $route['controller'];
            $methodName = $route['method'];

            // Check if the route is protected and the user is authenticated
            if (self::isRouteProtected($path, $method, $protectedRoutes)) {
                $required_key = $protectedRoutes[$path]['required_key'];
                if (!self::isAuthenticated($api_key, $required_key)) {
                    self::unauthorized(); // User is not authenticated, output an error
                    exit();
                }
            }

            self::executeRoute($controllerName, $methodName); // Execute the route
            exit();
        }
        self::routeNotFound(); // Route not found, output an error
    }

    /**
     * Checks if the specified route expects an ID parameter.
     *
     * @param string $controllerName The name of the controller.
     * @param string $methodName The name of the method in the controller.
     * @return bool Returns true if the route expects an ID parameter, otherwise false.
     */
    private static function routeExpectsId(string $controllerName, string $methodName): bool {
        // Construct the method reflection object
        $reflectionMethod = new \ReflectionMethod($controllerName, $methodName);

        // Check the parameters of the method
        $parameters = $reflectionMethod->getParameters();

        // Check if the parameter list is not empty
        if (!empty($parameters)) {
            foreach ($parameters as $parameter) {
                // If a parameter with the name "id" is found, an ID is expected
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
     * @return array|null Returns the matched route data if found, otherwise null.
     */
    private static function matchRoute(string $path, array $routes): ?array {
        foreach ($routes as $route => $routeData) {
            $pattern = str_replace('/', '\/', $route);
            $pattern = '/^' . str_replace('(\w+)',  '([\w-]+)', $pattern) . '$/';

            // Define $matches to store the results of matches
            $matches = [];

            if (preg_match($pattern, $path, $matches)) {
                // Check if the ID is found in the path
                if (isset($matches[1])) {
                    // Extract the ID from the path
                    $id = $matches[1];
                    // Adjust the GET variables to pass the ID to the controller
                    $_GET['id'] = $id;
                }
                return $routeData;
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
                // Check if the route expects an ID
                if (self::routeExpectsId($controllerName, $methodName)) {
                    // Pass the ID as an argument to the controller method
                    $controller->$methodName($_GET['id']);
                    exit();
                }
                // If no ID is expected, call the method without arguments
                $controller->$methodName();
                exit();
            }
        }
        self::controllerNotFound(); // Controller or method not found, output an error
    }

    /**
     * Checks if the specified route is protected and requires authentication.
     *
     * @param string $path The path of the request.
     * @param string $method The HTTP method of the request.
     * @param array $protectedRoutes A list of protected routes.
     * @return bool Returns true if the route is protected, otherwise false.
     */
    private static function isRouteProtected(string $path, string $method, array $protectedRoutes): bool {
        return isset($protectedRoutes[$path][$method]);
    }

    /**
     * Checks if the user is authenticated.
     *
     * @param string $api_key The API key provided by the user.
     * @param string $required_key The required API key for the protected route.
     * @return bool Returns true if the user is authenticated, otherwise false.
     */
    private static function isAuthenticated(string $api_key, string $required_key) {
        return $api_key && isset(Config::getApiKeys()[$required_key]) && $api_key == Config::getApiKeys()[$required_key];
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
