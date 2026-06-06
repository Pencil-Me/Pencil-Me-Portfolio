<?php

namespace Model;

use Exception;

/**
 * Model class for interacting with the dates table in the MySQL database.
 */
class DatesModel extends DatabaseModel
{
    /**
     * Retrieves dates grouped by project UUID for batch enrichment.
     *
     * @param array<int, string> $projectUuids
     * @return array<string, array<int, array<string, mixed>>>
     * @throws Exception
     */
    public function getDatesGroupedByProject(array $projectUuids): array
    {
        if ($projectUuids === []) {
            return [];
        }

        try {
            $placeholders = implode(', ', array_fill(0, count($projectUuids), 'UUID_TO_BIN(?)'));
            $datesQuery = "SELECT BIN_TO_UUID(project_id) as project_uuid, start_date, end_date FROM project_dates WHERE project_id IN ($placeholders)";
            $datesResults = $this->fetchAll($datesQuery, $projectUuids);

            $grouped = [];
            foreach ($datesResults as $datesResult) {
                $projectUuid = $datesResult['project_uuid'];
                $grouped[$projectUuid][] = [
                    'start_date' => $datesResult['start_date'],
                    'end_date' => $datesResult['end_date'],
                ];
            }

            return $grouped;
        } catch (Exception $e) {
            error_log($e->getMessage());
            throw new Exception('Failed to retrieve dates per project', 0, $e);
        }
    }

    /**
     * Retrieves dates associated with one or more projects from the database.
     *
     * @param array<int, string> $projectUuids Project UUIDs.
     * @return array<int, array<string, mixed>> The array of formatted date data.
     * @throws Exception If an error occurs during the database operation.
     */
    public function getDatesPerProject(array $projectUuids): array
    {
        if ($projectUuids === []) {
            return [];
        }

        if (count($projectUuids) === 1) {
            $grouped = $this->getDatesGroupedByProject($projectUuids);

            return $grouped[$projectUuids[0]] ?? [];
        }

        $grouped = $this->getDatesGroupedByProject($projectUuids);
        $flat = [];

        foreach ($projectUuids as $projectUuid) {
            foreach ($grouped[$projectUuid] ?? [] as $dateRow) {
                $flat[] = $dateRow;
            }
        }

        return $flat;
    }
}
