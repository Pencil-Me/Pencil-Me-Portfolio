<?php

namespace Controller\Api;

use Inc\AppLogger;
use JetBrains\PhpStorm\NoReturn;

/**
 * Base controller class holding common utility methods.
 */
class BaseController
{
    public function __call(string $name, array $arguments)
    {
        $this->jsonResponse(['message' => 'Endpoint not found'], 404);
    }

    protected function getUriSegments(): array
    {
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        return explode('/', (string) $uri);
    }

    protected function getQueryStringParams(): array
    {
        parse_str($_SERVER['QUERY_STRING'] ?? '', $query);
        return $query;
    }

    #[NoReturn] protected function jsonResponse(mixed $payload, int $status = 200): void
    {
        $this->clearCookies();
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($payload, JSON_THROW_ON_ERROR);
        exit;
    }

    protected function sendOutput(mixed $data, int $response_code): void
    {
        $this->jsonResponse($data, $response_code);
    }

    protected function clearCookies(): void
    {
        header_remove('Set-Cookie');
    }

    protected function isRequestMethodAllowed(string $allowedMethod): bool
    {
        $requestMethod = $_SERVER['REQUEST_METHOD'] ?? '';
        return strtoupper($requestMethod) === $allowedMethod;
    }

    #[NoReturn] protected function sendMethodNotAllowedResponse(): void
    {
        $this->jsonResponse(['message' => 'Method not allowed'], 405);
    }

    #[NoReturn] protected function sendSuccessResponse(array $data): void
    {
        $this->jsonResponse($data, 200);
    }

    #[NoReturn] protected function sendGenericErrorResponse(string $message, int $response_code = 500): void
    {
        $this->jsonResponse(['message' => $message], $response_code);
    }

    #[NoReturn] protected function sendErrorResponse(\Throwable $exception): void
    {
        AppLogger::error('Unhandled controller error', [
            'exception' => $exception->getMessage(),
            'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        ]);
        $this->sendGenericErrorResponse('An unexpected error occurred. Please try again later.', 500);
    }
}
