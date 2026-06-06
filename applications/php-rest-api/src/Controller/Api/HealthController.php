<?php

namespace Controller\Api;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Inc\Config;

/**
 * Health controller class holding the necessary application code to entertain REST API calls.
 */
class HealthController extends BaseController
{
    private Client $httpClient;

    public function __construct(?Client $httpClient = null)
    {
        $this->httpClient = $httpClient ?? new Client();
    }

    public function getHealthcheck(): void
    {
        $this->setSecurityHeaders();

        if (!$this->checkRateLimit()) {
            return;
        }

        try {
            $endpoint = Config::$healthApiEndpoint;
            $response = $this->httpClient->get($endpoint);
            $statusCode = $response->getStatusCode();
            $responseMessage = $statusCode === 200 ? 'Data forwarded successfully' : 'Error in forwarding data';

            $this->jsonResponse(['message' => $responseMessage], $statusCode);
        } catch (GuzzleException $e) {
            $this->jsonResponse(['message' => 'Error in making HTTP request: ' . $e->getMessage()], 500);
        }
    }
}
