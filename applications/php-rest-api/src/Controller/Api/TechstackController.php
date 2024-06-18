<?php

namespace Controller\Api;

use Model\DatesModel;
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

            foreach ($techstackData as &$techstack) {
                // Add Dates
                $techstack['dates'] = $this->getDatesPerTechstack($techstack['project_uuids']);
            }

            // Format the results according to the expected output format
            $formatedTechstackData = [];
            foreach ($techstackData as &$techstackResult) {
                $formatedTechstackData[] = [
                    "uuid" => $techstackResult['uuid'],
                    "name" => $techstackResult['name'],
                    "type" => $techstackResult['type'],
                    "expertise_level" => $techstackResult['expertise_level'],
                    "flag_important" => $techstackResult['flag_important'],
                    "last_usage_date" => $techstackResult['last_usage_date'],
                    "project_count" => $techstackResult['project_count'],
                    "project_dates" => $techstackResult['dates'],
                ];
            }

            // Send successful response
            $this->sendSuccessResponse($formatedTechstackData);
        } catch (\Throwable $exception) {
            // Handle exceptions
            $this->sendErrorResponse($exception);
        }
    }

    /**
     * Retrieves dates for a project.
     *
     * @param string $projectUuid The data of the project.
     * @return array Returns an array of date data.
     * @throws \Exception
     */
    private function getDatesPerTechstack(string | null $projectUuidsString): array
    {
        if ($projectUuidsString == null) { return []; }
        $projectUuids = explode(',', $projectUuidsString);

        $datesModel = new DatesModel();
        // Implement logic to retrieve dates per project
        return $datesModel->getDatesPerProject($projectUuids);
    }
}
