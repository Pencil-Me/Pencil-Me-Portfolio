<?php

namespace Controller\Api;

use Inc\Config;
use Inc\HttpClient;

/**
 * Health controller class holding the necessary application code to entertain REST API calls.
 */
class HealthController extends BaseController
{
    private HttpClient $httpClient;

    public function __construct(?HttpClient $httpClient = null)
    {
        $this->httpClient = $httpClient ?? new HttpClient();
    }

    public function getHealthcheck(): void
    {
        $this->setSecurityHeaders();

        try {
            $response = $this->httpClient->get(Config::$healthApiEndpoint);
            $statusCode = $response->statusCode;
            $responseMessage = $statusCode === 200 ? 'Data forwarded successfully' : 'Error in forwarding data';

            $this->jsonResponse(['message' => $responseMessage], $statusCode);
        } catch (\Throwable $e) {
            $this->jsonResponse(['message' => 'Error in making HTTP request: ' . $e->getMessage()], 500);
        }
    }
}
