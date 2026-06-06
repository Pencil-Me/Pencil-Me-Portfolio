<?php

namespace Controller\Api;

use Model\CustomersModel;

/**
 * Controller for handling REST API calls related to customers.
 */
class CustomersController extends BaseController
{
    private CustomersModel $customersModel;

    public function __construct(?CustomersModel $customersModel = null)
    {
        $this->customersModel = $customersModel ?? new CustomersModel();
    }

    public function getAllFe(): void
    {
        $this->setSecurityHeaders();

        if (!$this->checkRateLimit()) {
            return;
        }

        try {
            if (!$this->isRequestMethodAllowed('GET')) {
                $this->sendMethodNotAllowedResponse();
            }

            $limit = $this->getQueryLimit();
            $customersData = $this->customersModel->getCustomers($limit);

            $this->sendSuccessResponse($customersData);
        } catch (\Throwable $exception) {
            $this->sendErrorResponse($exception);
        }
    }
}
