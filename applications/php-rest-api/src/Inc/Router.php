<?php

namespace Inc;

/**
 * The Router class is responsible for handling HTTP requests and routing to the appropriate controllers and methods.
 */
class Router
{
    /**
     * @param array<string, array<string, array<string, string>>> $routes
     * @param array<string, array<string, bool|string>> $protectedRoutes
     */
    public static function route(string $method, string $path, string $api_key, array $routes, array $protectedRoutes): void
    {
        $matchedRoute = self::matchRoute($path, $routes);
        if ($matchedRoute !== null && isset($matchedRoute['handlers'][$method])) {
            $route = $matchedRoute['handlers'][$method];
            $routePattern = $matchedRoute['pattern'];
            $controllerName = $route['controller'];
            $methodName = $route['method'];
            $routeParams = $matchedRoute['params'];

            if (self::isRouteProtected($routePattern, $method, $protectedRoutes)) {
                $required_key = $protectedRoutes[$routePattern]['required_key'];
                if (!self::isAuthenticated($api_key, (string) $required_key)) {
                    self::unauthorized();
                }
            }

            self::executeRoute($controllerName, $methodName, $routeParams);
        }
        self::routeNotFound();
    }

    private static function routeExpectsId(string $controllerName, string $methodName): bool
    {
        $reflectionMethod = new \ReflectionMethod($controllerName, $methodName);
        $parameters = $reflectionMethod->getParameters();

        foreach ($parameters as $parameter) {
            if ($parameter->getName() === 'id') {
                return true;
            }
        }

        return false;
    }

    /**
     * @param array<string, array<string, array<string, string>>> $routes
     * @return array{pattern: string, handlers: array<string, array<string, string>>, params: array<string, string>}|null
     */
    private static function matchRoute(string $path, array $routes): ?array
    {
        foreach ($routes as $route => $routeData) {
            $pattern = str_replace('/', '\/', $route);
            $pattern = '/^' . str_replace('(\w+)', '([\w-]+)', $pattern) . '$/';

            $matches = [];

            if (preg_match($pattern, $path, $matches)) {
                $params = [];
                if (isset($matches[1])) {
                    if (!self::isValidUuid($matches[1])) {
                        return null;
                    }
                    $params['id'] = $matches[1];
                }

                return [
                    'pattern' => $route,
                    'handlers' => $routeData,
                    'params' => $params,
                ];
            }
        }

        return null;
    }

    private static function isValidUuid(string $uuid): bool
    {
        return preg_match('/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i', $uuid) === 1;
    }

    /**
     * @param array<string, string> $routeParams
     */
    private static function executeRoute(string $controllerName, string $methodName, array $routeParams): void
    {
        if (class_exists($controllerName)) {
            $controller = new $controllerName();

            if (method_exists($controller, $methodName)) {
                if (self::routeExpectsId($controllerName, $methodName)) {
                    $controller->$methodName($routeParams['id'] ?? '');
                    exit();
                }
                $controller->$methodName();
                exit();
            }
        }
        self::controllerNotFound();
    }

    private static function isRouteProtected(string $routePattern, string $method, array $protectedRoutes): bool
    {
        return isset($protectedRoutes[$routePattern][$method]);
    }

    private static function isAuthenticated(string $api_key, string $required_key): bool
    {
        if ($api_key === '' || !isset(Config::getApiKeys()[$required_key])) {
            return false;
        }

        return hash_equals(
            (string) Config::getApiKeys()[$required_key],
            (string) $api_key
        );
    }

    private static function routeNotFound(): void
    {
        CorsHeaders::apply();
        http_response_code(404);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['message' => 'Requested Route Not Found']);
        exit;
    }

    private static function controllerNotFound(): void
    {
        CorsHeaders::apply();
        http_response_code(404);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['message' => 'Controller or Method Not Found']);
        exit;
    }

    private static function unauthorized(): void
    {
        CorsHeaders::apply();
        http_response_code(401);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['message' => 'Unauthorized']);
        exit;
    }
}
