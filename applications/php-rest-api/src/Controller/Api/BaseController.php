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
    #[NoReturn] public function __call(string $name, array $arguments)
    {
        $this->sendOutput('', 404);
    }

    /**
     * Retrieve URI segments.
     *
     * @return array The array containing URI segments.
     */
    protected function getUriSegments(): array
    {
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        return explode('/', $uri);
    }

    /**
     * Retrieve query string parameters.
     *
     * @return array The array containing query string parameters.
     */
    protected function getQueryStringParams(): array
    {
        parse_str($_SERVER['QUERY_STRING'], $query);
        return $query;
    }

    /**
     * Send API output.
     *
     * @param mixed $data The data to be sent as output.
     * @param array $httpHeaders An array of HTTP headers to be sent.
     */
    #[NoReturn] protected function sendOutput($data, int $response_code): void
    {
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
        header_remove('Set-Cookie');
    }

    /**
     * Get the limit from query parameters.
     *
     * @param string $allowedMethod The allowed Method.
     * @return bool Is the Request Method is the Allowed Method.
     */
    protected function isRequestMethodAllowed(string $allowedMethod): bool
    {
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        return (strtoupper($requestMethod) == $allowedMethod);
    }

    /**
     * Get the limit from query parameters.
     *
     * @return int The limit value.
     */
    protected function getQueryLimit(): int {
        $queryParams = $this->getQueryStringParams();

        // set default limit
        $limit = 50;

        // Check if limit parameter is provided in the query string
        if (isset($queryParams['limit']) && $queryParams['limit']) {
            $limit = $queryParams['limit'];
        }

        // Convert limit to integer and return
        return intval($limit);
    }

    /**
     * Sends a response indicating that the request method is not allowed.
     */
    #[NoReturn] protected function sendMethodNotAllowedResponse(): void
    {
        $this->sendOutput(['error' => 'Method not allowed'], 405);
    }

    /**
     * Sends a response indicating that the requested resource was not found.
     *
     * @param string $message The error message.
     */
    #[NoReturn] protected function sendNotFoundResponse(string $message): void
    {
        $this->sendOutput(['error' => $message], 404);
    }

    /**
     * Sends a successful response with the provided data.
     *
     * @param array $data The data to be sent.
     */
    #[NoReturn] protected function sendSuccessResponse(array $data): void
    {
        $this->sendOutput($data, 200);
    }

    /**
     * Sends an error response based on the provided exception.
     *
     * @param \Throwable $exception The exception.
     */
    #[NoReturn] protected function sendErrorResponse(\Throwable $exception): void
    {
        $this->sendOutput(['error' => $exception->getMessage() . ' Something went wrong! Please contact support.'], 500);
    }
}
