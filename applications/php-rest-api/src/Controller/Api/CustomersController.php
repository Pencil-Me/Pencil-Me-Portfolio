<?php

namespace Controller\Api;

use Model\CustomersModel;

/**
 * Controller for handling REST API calls related to customers.
 */
class CustomersController extends BaseController
{
    /**
     * Retrieves all customers.
     */
    public function getAllFe(): void
    {
        try {
            // Check if the request method is GET
            if (!$this->isRequestMethodAllowed('GET')) {
                // Send error response for unsupported request method
                $this->sendMethodNotAllowedResponse();
            }

            // Instantiate CustomersModel
            $customersModel = new CustomersModel();

            // Set default limit
            $limit = $this->getQueryLimit();

            // Retrieve customers data
            $customersData = $customersModel->getCustomers($limit);

            // Send successful response
            $this->sendSuccessResponse($customersData);
        } catch (\Throwable $exception) {
            // Handle exceptions
            $this->sendErrorResponse($exception);
        }
    }
}
