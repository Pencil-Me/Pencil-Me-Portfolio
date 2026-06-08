<?php

namespace Controller\Api;

use JetBrains\PhpStorm\NoReturn;
use Inc\Bootstrap;
use Inc\CorsHeaders;

/**
 * Base controller class holding common utility methods.
 */
class BaseController
{
    private const MAX_TEXT_LENGTH = 5000;
    private const DEFAULT_QUERY_LIMIT = 100;
    private const MAX_QUERY_LIMIT = 100;

    #[NoReturn] public function __call(string $name, array $arguments)
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

    /**
     * Sends a JSON response and terminates the request.
     *
     * @param mixed $payload Response body (array or scalar).
     */
    #[NoReturn] protected function jsonResponse(mixed $payload, int $status = 200): void
    {
        $this->clearCookies();
        CorsHeaders::apply();
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($payload, JSON_THROW_ON_ERROR);
        exit;
    }

    #[NoReturn] protected function sendOutput(mixed $data, int $response_code): void
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

    protected function getQueryLimit(): int
    {
        $queryParams = $this->getQueryStringParams();
        $limit = self::DEFAULT_QUERY_LIMIT;

        if (array_key_exists('limit', $queryParams) && $queryParams['limit'] !== '' && $queryParams['limit'] !== null) {
            $limit = (int) $queryParams['limit'];
        }

        return max(1, min($limit, self::MAX_QUERY_LIMIT));
    }

    #[NoReturn] protected function sendMethodNotAllowedResponse(): void
    {
        $this->jsonResponse(['message' => 'Method not allowed'], 405);
    }

    #[NoReturn] protected function sendNotFoundResponse(string $message): void
    {
        $this->jsonResponse(['message' => $message], 404);
    }

    #[NoReturn] protected function sendSuccessResponse(array $data): void
    {
        $this->jsonResponse($data, 200);
    }

    #[NoReturn] protected function sendErrorResponse(\Throwable $exception): void
    {
        Bootstrap::$logger->error($exception->getMessage(), [
            'exception' => $exception,
            'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        ]);

        $this->jsonResponse(['message' => 'An unexpected error occurred. Please try again later.'], 500);
    }

    protected function sanitizeInt(mixed $input): ?int
    {
        return filter_var($input, FILTER_VALIDATE_INT, FILTER_NULL_ON_FAILURE);
    }

    /**
     * Validates plain-text input (replaces deprecated FILTER_SANITIZE_STRING).
     */
    protected function sanitizeString(mixed $input, int $maxLength = self::MAX_TEXT_LENGTH): ?string
    {
        if (!is_string($input)) {
            return null;
        }

        $value = trim($input);

        if ($value === '' || strlen($value) > $maxLength || str_contains($value, "\0")) {
            return null;
        }

        return $value;
    }

    protected function sanitizeUuid(mixed $input): ?string
    {
        if (!is_string($input) && !is_numeric($input)) {
            return null;
        }

        $uuid = strtolower(trim((string) $input));

        if (preg_match('/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/', $uuid) !== 1) {
            return null;
        }

        return $uuid;
    }

    protected function setSecurityHeaders(): void
    {
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: DENY');
        header('Content-Security-Policy: default-src \'self\'');
    }
}
