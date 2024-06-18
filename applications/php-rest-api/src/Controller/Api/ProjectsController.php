<?php

namespace Controller\Api;

use Model\CustomersModel;
use Model\DatesModel;
use Model\ProjectsModel;
use Model\TechstackModel;

/**
 * Projects controller class responsible for handling REST API calls related to projects.
 */
class ProjectsController extends BaseController
{
    /**
     * Retrieves project data by ID.
     *
     * @param int $id The ID of the project.
     */
    public function getProjectFe($id): void {
        try {
            // Check if the request method is GET
            if (!$this->isRequestMethodAllowed('GET')) {
                // Send error response for unsupported request method
                $this->sendOutput(
                    json_encode(['error' => 'Method not supported']),
                    422
                );
            }

            // Instantiate ProjectsModel
            $projectsModel = new ProjectsModel();

            // Retrieve projects data
            $projectData = $projectsModel->getProject($id);

            // Add TechStack
            $projectData['tech'] = $this->getTechstacksPerProject($projectData['techstack_uuids']);

            // Add Dates
            $projectData['dates'] = $this->getDatesPerProject($projectData['uuid']);

            // Add Customers
            $projectData['customers'] = $this->getCustomersPerProject($projectData['customer_uuids']);

            // Format the results according to the expected output format
            $formatedProjectsData = [
                "uuid" => $projectData['uuid'],
                "name" => $projectData['name'],
                "location" => $projectData['location'],
                "position" => $projectData['position'],
                "content" => $projectData['content'],
                "tech" => $projectData['tech'],
                "customers" => $projectData['customers'],
                "dates" => $projectData['dates'],
                "type" => $projectData['type']
            ];

            // Send successful response
            $this->sendSuccessResponse($formatedProjectsData);
        } catch (\Throwable $exception) {
            // Handle exceptions
            $this->sendOutput(
                $exception->getMessage() . ' Something went wrong! Please contact support.',
                500
            );
        }
    }

    /**
     * Retrieves all projects.
     */
    public function getAllFe(): void
    {
        try {
            // Check if the request method is GET
            if (!$this->isRequestMethodAllowed('GET')) {
                // Send error response for unsupported request method
                $this->sendMethodNotAllowedResponse();
            }

            // Instantiate ProjectsModel
            $projectsModel = new ProjectsModel();

            // Set default limit
            $limit = $this->getQueryLimit();

            // Retrieve projects data
            $projectsData = $projectsModel->getProjects($limit);

            foreach ($projectsData as &$project) {
                // Add TechStack
                $project['tech'] = $this->getTechstacksPerProject($project['techstack_uuids']);

                // Add Dates
                $project['dates'] = $this->getDatesPerProject($project['uuid']);

                // Add Customers
                $project['customers'] = $this->getCustomersPerProject($project['customer_uuids']);
            }

            // Format the results according to the expected output format
            $formatedProjectsData = [];
            foreach ($projectsData as $projectResult) {
                $formatedProjectsData[] = [
                    "uuid" => $projectResult['uuid'],
                    "name" => $projectResult['name'],
                    "location" => $projectResult['location'],
                    "position" => $projectResult['position'],
                    "content" => $projectResult['content'],
                    "tech" => $projectResult['tech'],
                    "customers" => $projectResult['customers'],
                    "dates" => $projectResult['dates'],
                    "type" => $projectResult['type']
                ];
            }

            // Send successful response
            $this->sendSuccessResponse($formatedProjectsData);
        } catch (\Throwable $exception) {
            // Handle exceptions
            $this->sendErrorResponse($exception);
        }
    }

    //--------------------------------

    // Additional methods...

    /**
     * Retrieves techstacks for a project.
     *
     * @param string | null $techstackUuidsString The UUIDs of techstacks associated with the project.
     * @return array Returns an array of techstack data.
     * @throws \Exception
     */
    private function getTechstacksPerProject(?string $techstackUuidsString): array
    {
        if ($techstackUuidsString == null) { return []; }

        $techstackUuids = explode(',', $techstackUuidsString);
        $techstackModel = new TechstackModel();
        return $techstackModel->getTechstacksPerProject($techstackUuids);
    }

    /**
     * Retrieves dates for a project.
     *
     * @param string $projectUuid The data of the project.
     * @return array Returns an array of date data.
     * @throws \Exception
     */
    private function getDatesPerProject(string $projectUuid): array
    {
        $datesModel = new DatesModel();
        // Implement logic to retrieve dates per project
        return $datesModel->getDatesPerProject([$projectUuid]);
    }

    /**
     * Retrieves customers for a project.
     *
     * @param string|null $customerUuidsString The UUIDs of customers associated with the project.
     * @return array Returns an array of customer data.
     * @throws \Exception
     */
    private function getCustomersPerProject(?string $customerUuidsString): array
    {
        if ($customerUuidsString == null) { return []; }

        $customerUuids = explode(',', $customerUuidsString);
        $customersModel = new CustomersModel();
        return $customersModel->getCustomersPerProject($customerUuids);
    }
}
