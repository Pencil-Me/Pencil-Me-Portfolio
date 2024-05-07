<?php

namespace Controller\Api;

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
        // Perform any health checks here
        // For this example, we simply return "OK"
        $responseData = json_encode(["status" => "OK"]);

        // Send output with appropriate headers
        $this->sendOutput(
            $responseData,
            200
        );
    }
}
