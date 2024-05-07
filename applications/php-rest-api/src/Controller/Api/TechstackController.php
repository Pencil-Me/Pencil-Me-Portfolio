<?php

namespace Controller\Api;

use Model\TechstackModel;

/**
 * Techstack controller class responsible for handling REST API calls related to techstacks.
 */
class TechstackController extends BaseController
{
    /**
     * Retrieves all techstacks.
     */
    public function getAllFe(): void
    {
        try {
            // Check if the request method is GET
            if (!$this->isRequestMethodAllowed('GET')) {
                // Send error response for unsupported request method
                $this->sendMethodNotAllowedResponse();
            }

            // Instantiate TechstackModel
            $techstackModel = new TechstackModel();

            // Set default limit
            $limit = $this->getQueryLimit();

            // Retrieve techstack data
            $techstackData = $techstackModel->getTechstacks($limit);

            // Send successful response
            $this->sendSuccessResponse($techstackData);
        } catch (\Throwable $exception) {
            // Handle exceptions
            $this->sendErrorResponse($exception);
        }
    }
}
