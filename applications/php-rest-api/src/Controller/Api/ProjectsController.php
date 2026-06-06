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
    private ProjectsModel $projectsModel;
    private TechstackModel $techstackModel;
    private DatesModel $datesModel;
    private CustomersModel $customersModel;

    public function __construct(
        ?ProjectsModel $projectsModel = null,
        ?TechstackModel $techstackModel = null,
        ?DatesModel $datesModel = null,
        ?CustomersModel $customersModel = null
    ) {
        $this->projectsModel = $projectsModel ?? new ProjectsModel();
        $this->techstackModel = $techstackModel ?? new TechstackModel();
        $this->datesModel = $datesModel ?? new DatesModel();
        $this->customersModel = $customersModel ?? new CustomersModel();
    }

    public function getProjectFe($id): void {
        $this->setSecurityHeaders();

        if (!$this->checkRateLimit()) {
            return;
        }

        try {
            $projectUuid = $this->sanitizeUuid($id);
            if ($projectUuid === null) {
                $this->jsonResponse(['message' => 'Invalid project ID'], 400);
            }

            if (!$this->isRequestMethodAllowed('GET')) {
                $this->sendMethodNotAllowedResponse();
            }

            $projectData = $this->projectsModel->getProject($projectUuid);

            if (!$projectData) {
                $this->sendNotFoundResponse('Project not found');
            }

            $projectData['tech'] = $this->getTechstacksPerProject($projectData['techstack_uuids']);
            $projectData['dates'] = $this->getDatesPerProject($projectData['uuid']);
            $projectData['customers'] = $this->getCustomersPerProject($projectData['customer_uuids']);

            $this->sendSuccessResponse($this->formatProjectData($projectData));
        } catch (\Throwable $exception) {
            $this->sendErrorResponse($exception);
        }
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
            $projectsData = $this->projectsModel->getProjects($limit);

            foreach ($projectsData as &$project) {
                $project['tech'] = $this->getTechstacksPerProject($project['techstack_uuids']);
                $project['dates'] = $this->getDatesPerProject($project['uuid']);
                $project['customers'] = $this->getCustomersPerProject($project['customer_uuids']);
            }

            $formatedProjectsData = [];
            foreach ($projectsData as $projectResult) {
                $formatedProjectsData[] = [
                    'uuid' => $projectResult['uuid'],
                    'name' => $projectResult['name'],
                    'location' => $projectResult['location'],
                    'position' => $projectResult['position'],
                    'content' => $projectResult['content'],
                    'tech' => $projectResult['tech'],
                    'customers' => $projectResult['customers'],
                    'dates' => $projectResult['dates'],
                    'type' => $projectResult['type']
                ];
            }

            $this->sendSuccessResponse($formatedProjectsData);
        } catch (\Throwable $exception) {
            $this->sendErrorResponse($exception);
        }
    }

    private function getTechstacksPerProject(?string $techstackUuidsString): array
    {
        if ($techstackUuidsString === null) {
            return [];
        }

        $techstackUuids = explode(',', $techstackUuidsString);
        return $this->techstackModel->getTechstacksPerProject($techstackUuids);
    }

    private function getDatesPerProject(string $projectUuid): array
    {
        return $this->datesModel->getDatesPerProject([$projectUuid]);
    }

    private function getCustomersPerProject(?string $customerUuidsString): array
    {
        if ($customerUuidsString === null) {
            return [];
        }

        $customerUuids = explode(',', $customerUuidsString);
        return $this->customersModel->getCustomersPerProject($customerUuids);
    }

    private function formatProjectData(array $projectData): array
    {
        return [
            'uuid' => $projectData['uuid'],
            'name' => $projectData['name'],
            'location' => $projectData['location'],
            'position' => $projectData['position'],
            'content' => $projectData['content'],
            'tech' => $projectData['tech'],
            'customers' => $projectData['customers'],
            'dates' => $projectData['dates'],
            'type' => $projectData['type']
        ];
    }
}
