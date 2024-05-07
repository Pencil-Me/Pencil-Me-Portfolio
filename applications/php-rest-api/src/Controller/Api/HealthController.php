<?php

namespace Controller\Api;

use Inc\Config;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;

/**
 * Health controller class holding the necessary application code to entertain REST API calls.
 */
class HealthController extends BaseController
{
    /**
     * Performs a health check for the API.
     */
    public function getHealthcheck(): void
    {
        try {
            // Initialize Guzzle HTTP client
            $client = new Client();

            // Target URL of the API
            $endpoint = Config::$healthApiEndpoint;

            // Send GET request to the endpoint
            $response = $client->get($endpoint);

            // Get the status code from the response
            $statusCode = $response->getStatusCode();

            // Send appropriate response based on the status code
            if ($statusCode === 200) {
                // Data forwarded successfully
                $responseMessage = 'Data forwarded successfully';
            } else {
                // Error in forwarding data
                $responseMessage = 'Error in forwarding data';
            }

            // Send response
            $this->sendOutput(json_encode([
                'message' => $responseMessage
            ]), $statusCode);
        } catch (GuzzleException $e) {
            // Error in making HTTP request
            $this->sendOutput(json_encode([
                'message' => 'Error in making HTTP request: ' . $e->getMessage()
            ]), 500);
        }
    }
}
