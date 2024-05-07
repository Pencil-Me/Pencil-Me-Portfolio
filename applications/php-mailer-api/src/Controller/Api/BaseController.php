<?php

namespace Controller\Api;

use JetBrains\PhpStorm\NoReturn;

/**
 * Base controller class holding common utility methods.
 */
class BaseController
{
    /**
     * Magic method to handle undefined method calls.
     *
     * @param string $name The name of the method being called.
     * @param array $arguments The arguments passed to the method.
     */
    public function __call(string $name, array $arguments)
    {
        // If an undefined method is called, send a "Not Found" response
        $this->sendOutput(['error' => 'Endpoint not found'], 404);
    }

    /**
     * Get URI segments.
     *
     * @return array The array containing URI segments.
     */
    protected function getUriSegments(): array
    {
        // Parse the URI and return its segments
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        return explode('/', $uri);
    }

    /**
     * Get query string parameters.
     *
     * @return array The array containing query string parameters.
     */
    protected function getQueryStringParams(): array
    {
        // Parse the query string and return its parameters
        parse_str($_SERVER['QUERY_STRING'], $query);
        return $query;
    }

    /**
     * Send API output.
     *
     * @param mixed $data The data to be sent as output.
     * @param int $response_code The HTTP response code.
     */
    protected function sendOutput($data, int $response_code): void
    {
        // Clear cookies, set the HTTP response code, and send the JSON-encoded data
        $this->clearCookies();
        http_response_code($response_code);
        echo json_encode($data);
        exit;
    }

    /**
     * Clear cookies from the response.
     */
    protected function clearCookies(): void
    {
        // Remove any set cookies from the response headers
        header_remove('Set-Cookie');
    }

    /**
     * Check if the request method is allowed.
     *
     * @param string $allowedMethod The allowed HTTP method.
     * @return bool Whether the request method is allowed or not.
     */
    protected function isRequestMethodAllowed(string $allowedMethod): bool
    {
        // Get the request method and check if it matches the allowed method
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        return strtoupper($requestMethod) === $allowedMethod;
    }

    /**
     * Sends a response indicating that the request method is not allowed.
     */
    #[NoReturn] protected function sendMethodNotAllowedResponse(): void
    {
        // Send a "Method Not Allowed" response
        $this->sendOutput(['error' => 'Method not allowed'], 405);
    }

    /**
     * Sends a successful response with the provided data.
     *
     * @param array $data The data to be sent.
     */
    #[NoReturn] protected function sendSuccessResponse(array $data): void
    {
        // Send a successful response with the provided data
        $this->sendOutput($data, 200);
    }

    /**
     * Sends an error response based on the provided exception.
     *
     * @param \Throwable $exception The exception.
     */
    #[NoReturn] protected function sendErrorResponse(\Throwable $exception): void
    {
        // Send an error response with the exception message and a generic error message
        $this->sendOutput(['error' => $exception->getMessage() . ' Something went wrong! Please contact support.'], 500);
    }
}
