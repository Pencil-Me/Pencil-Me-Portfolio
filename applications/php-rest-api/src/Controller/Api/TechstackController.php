<?php

namespace Controller\Api;

use Model\DatesModel;
use Model\TechstackModel;

/**
 * Techstack controller class responsible for handling REST API calls related to techstacks.
 */
class TechstackController extends BaseController
{
    private TechstackModel $techstackModel;
    private DatesModel $datesModel;

    public function __construct(
        ?TechstackModel $techstackModel = null,
        ?DatesModel $datesModel = null
    ) {
        $this->techstackModel = $techstackModel ?? new TechstackModel();
        $this->datesModel = $datesModel ?? new DatesModel();
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
            $techstackData = $this->techstackModel->getTechstacks($limit);

            foreach ($techstackData as &$techstack) {
                $techstackUUIDs = $this->techstackModel->getProjectsPerTechstacks($techstack['uuid'], $limit);
                $flatTechstackUUIDsArray = array_map(static fn(array $row): string => $row['uuid'], $techstackUUIDs);
                $techstack['dates'] = $this->getDatesPerTechstack($flatTechstackUUIDsArray);
            }

            $formatedTechstackData = [];
            foreach ($techstackData as $techstackResult) {
                $formatedTechstackData[] = [
                    'uuid' => $techstackResult['uuid'],
                    'name' => $techstackResult['name'],
                    'type' => $techstackResult['type'],
                    'expertise_level' => $techstackResult['expertise_level'],
                    'flag_important' => $techstackResult['flag_important'],
                    'last_usage_date' => $techstackResult['last_usage_date'],
                    'project_count' => $techstackResult['project_count'],
                    'project_dates' => $techstackResult['dates'],
                ];
            }

            $this->sendSuccessResponse($formatedTechstackData);
        } catch (\Throwable $exception) {
            $this->sendErrorResponse($exception);
        }
    }

    private function getDatesPerTechstack(?array $projectUuids): array
    {
        if ($projectUuids === null || $projectUuids === []) {
            return [];
        }

        return $this->datesModel->getDatesPerProject($projectUuids);
    }
}
