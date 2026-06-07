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

    public function getProjectFe($id): void
    {
        $this->setSecurityHeaders();

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

        try {
            if (!$this->isRequestMethodAllowed('GET')) {
                $this->sendMethodNotAllowedResponse();
            }

            $limit = $this->getQueryLimit();
            $projectsData = $this->projectsModel->getProjects($limit);
            $formattedProjectsData = $this->enrichProjectsForFrontend($projectsData);

            $this->sendSuccessResponse($formattedProjectsData);
        } catch (\Throwable $exception) {
            $this->sendErrorResponse($exception);
        }
    }

    /**
     * @param array<int, array<string, mixed>> $projectsData
     * @return array<int, array<string, mixed>>
     */
    private function enrichProjectsForFrontend(array $projectsData): array
    {
        if ($projectsData === []) {
            return [];
        }

        $uuidBuckets = $this->collectRelatedUuids($projectsData);
        $techByUuid = $this->techstackModel->getTechstacksByUuids($uuidBuckets['tech']);
        $customersByUuid = $this->customersModel->getCustomersByUuids($uuidBuckets['customers']);
        $datesByProject = $this->datesModel->getDatesGroupedByProject($uuidBuckets['projects']);

        $formattedProjectsData = [];
        foreach ($projectsData as $projectResult) {
            $projectUuid = $projectResult['uuid'];
            $formattedProjectsData[] = $this->formatProjectData([
                'uuid' => $projectUuid,
                'name' => $projectResult['name'],
                'location' => $projectResult['location'],
                'position' => $projectResult['position'],
                'content' => $projectResult['content'],
                'content_short' => $projectResult['content_short'] ?? null,
                'content_long' => $projectResult['content_long'] ?? null,
                'type' => $projectResult['type'],
                'featured_rank' => $projectResult['featured_rank'] ?? null,
                'featured_tag' => $projectResult['featured_tag'] ?? null,
                'featured_problem' => $projectResult['featured_problem'] ?? null,
                'featured_role' => $projectResult['featured_role'] ?? null,
                'featured_outcome' => $projectResult['featured_outcome'] ?? null,
                'tech' => $this->mapRelatedEntities($projectResult['techstack_uuids'] ?? null, $techByUuid),
                'customers' => $this->mapRelatedEntities($projectResult['customer_uuids'] ?? null, $customersByUuid),
                'dates' => $datesByProject[$projectUuid] ?? [],
            ]);
        }

        return $formattedProjectsData;
    }

    /**
     * @param array<int, array<string, mixed>> $projectsData
     * @return array{projects: array<int, string>, tech: array<int, string>, customers: array<int, string>}
     */
    private function collectRelatedUuids(array $projectsData): array
    {
        $projectUuids = [];
        $techUuids = [];
        $customerUuids = [];

        foreach ($projectsData as $project) {
            $projectUuids[] = $project['uuid'];

            foreach ($this->splitUuidList($project['techstack_uuids'] ?? null) as $uuid) {
                $techUuids[$uuid] = true;
            }

            foreach ($this->splitUuidList($project['customer_uuids'] ?? null) as $uuid) {
                $customerUuids[$uuid] = true;
            }
        }

        return [
            'projects' => $projectUuids,
            'tech' => array_keys($techUuids),
            'customers' => array_keys($customerUuids),
        ];
    }

    /**
     * @return array<int, string>
     */
    private function splitUuidList(?string $uuidList): array
    {
        if ($uuidList === null || $uuidList === '') {
            return [];
        }

        return array_values(array_filter(explode(',', $uuidList), static fn(string $uuid): bool => $uuid !== ''));
    }

    /**
     * @param array<string, array<string, mixed>> $entitiesByUuid
     * @return array<int, array<string, mixed>>
     */
    private function mapRelatedEntities(?string $uuidList, array $entitiesByUuid): array
    {
        $mapped = [];

        foreach ($this->splitUuidList($uuidList) as $uuid) {
            if (isset($entitiesByUuid[$uuid])) {
                $mapped[] = $entitiesByUuid[$uuid];
            }
        }

        return $mapped;
    }

    private function getTechstacksPerProject(?string $techstackUuidsString): array
    {
        return $this->techstackModel->getTechstacksPerProject($this->splitUuidList($techstackUuidsString));
    }

    private function getDatesPerProject(string $projectUuid): array
    {
        return $this->datesModel->getDatesPerProject([$projectUuid]);
    }

    private function getCustomersPerProject(?string $customerUuidsString): array
    {
        return $this->customersModel->getCustomersPerProject($this->splitUuidList($customerUuidsString));
    }

    /**
     * @param array<string, mixed> $projectData
     * @return array<string, mixed>
     */
    private function formatProjectData(array $projectData): array
    {
        return [
            'uuid' => $projectData['uuid'],
            'name' => $projectData['name'],
            'location' => $projectData['location'],
            'position' => $projectData['position'],
            'content' => $projectData['content'],
            'content_short' => $projectData['content_short'] ?? null,
            'content_long' => $projectData['content_long'] ?? null,
            'tech' => $projectData['tech'],
            'customers' => $projectData['customers'],
            'dates' => $projectData['dates'],
            'type' => $projectData['type'],
            'featured_rank' => isset($projectData['featured_rank']) ? (int) $projectData['featured_rank'] : null,
            'featured_tag' => $projectData['featured_tag'] ?? null,
            'featured_problem' => $projectData['featured_problem'] ?? null,
            'featured_role' => $projectData['featured_role'] ?? null,
            'featured_outcome' => $projectData['featured_outcome'] ?? null,
        ];
    }
}
