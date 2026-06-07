<?php

namespace Model;

use Exception;
use PDO;

/**
 * Model class for interacting with the techstack table in the MySQL database.
 */
class TechstackModel extends DatabaseModel
{
    /**
     * Retrieves techstack rows keyed by UUID for batch project enrichment.
     *
     * @param array<int, string> $techstackUuids
     * @return array<string, array<string, mixed>>
     * @throws Exception
     */
    public function getTechstacksByUuids(array $techstackUuids): array
    {
        if ($techstackUuids === []) {
            return [];
        }

        $techstackResults = $this->fetchTechstackRows($techstackUuids);
        $byUuid = [];

        foreach ($techstackResults as $techstackResult) {
            $byUuid[$techstackResult['uuid']] = [
                'uuid' => $techstackResult['uuid'],
                'name' => $techstackResult['name'],
                'type' => $techstackResult['type'],
                'expertise_level' => $techstackResult['expertise_level'],
            ];
        }

        return $byUuid;
    }

    /**
     * Retrieves all techstacks associated with a project.
     *
     * @param array<int, string> $techstackUuids An array of techstack UUIDs.
     * @return array<int, array<string, mixed>> Formatted techstack data.
     * @throws Exception If an error occurs during execution.
     */
    public function getTechstacksPerProject(array $techstackUuids): array
    {
        if ($techstackUuids === []) {
            return [];
        }

        try {
            $techstackResults = $this->fetchTechstackRows($techstackUuids);
            $formattedResults = [];

            foreach ($techstackResults as $techstackResult) {
                $formattedResults[] = [
                    'uuid' => $techstackResult['uuid'],
                    'name' => $techstackResult['name'],
                    'type' => $techstackResult['type'],
                    'expertise_level' => $techstackResult['expertise_level'],
                ];
            }

            return $formattedResults;
        } catch (Exception $e) {
            error_log($e->getMessage());
            throw new Exception('Failed to retrieve techstacks per project', 0, $e);
        }
    }

    /**
     * @param array<int, string> $techstackUuids
     * @return array<int, array<string, mixed>>
     * @throws Exception
     */
    private function fetchTechstackRows(array $techstackUuids): array
    {
        $placeholders = implode(', ', array_fill(0, count($techstackUuids), 'UUID_TO_BIN(?)'));
        $techstackQuery = "
            SELECT
                BIN_TO_UUID(t.uuid) AS uuid,
                t.name,
                (
                    SELECT tt.type
                    FROM techstack_type tt
                    WHERE tt.id = t.type
                ) AS type,
                t.expertise_level
            FROM techstack t
            WHERE t.uuid IN ($placeholders)
        ";
        return $this->fetchAll($techstackQuery, $techstackUuids);
    }


    /**
     * Retrieves techstack information from the database.
     *
     * @param int $limit The maximum number of techstacks to retrieve.
     * @return array Returns an array containing techstack data.
     * @throws Exception
     */
    public function getTechstacks(int $limit): array
    {
        try {
            // Define the SQL query to retrieve techstack information with associated data
            $query = "
                SELECT
                    BIN_TO_UUID(t.uuid) AS uuid,
                    t.name,
                    (
                        SELECT
                            tt.type
                        FROM
                            techstack_type tt
                        WHERE
                            id = t.type
                    ) AS type,
                    t.expertise_level,
                    t.flag_important,
                    (
                        SELECT
                            MAX(COALESCE(p.end_date, CURDATE()))
                        FROM
                            project_dates p
                        JOIN
                            project_techstack pt2 ON p.project_id = pt2.project_id
                        WHERE
                            pt2.techstack_id = t.uuid
                    ) AS last_usage_date,
                    COUNT(DISTINCT pt.project_id) AS project_count
                FROM
                    techstack t
                LEFT JOIN
                    project_techstack pt ON t.uuid = pt.techstack_id
                GROUP BY
                    t.uuid, t.name, type, t.expertise_level, t.flag_important
                LIMIT :limit;
            ";

            // Define the parameters for the query
            $params = [":limit" => $limit];
            $paramTypes = [":limit" => PDO::PARAM_INT];

            // Execute the query and return the results
            return $this->fetchAll($query, $params, $paramTypes);
        } catch (Exception $e) {
            // Log the error
            error_log($e->getMessage());

            // Throw an exception to indicate failure
            throw new Exception("getTechstacks");
        }
    }


    /**
     * Retrieves techstack information from the database.
     *
     * @param int $limit The maximum number of techstacks to retrieve.
     * @return array Returns an array containing techstack data.
     * @throws Exception
     */
    public function getProjectsPerTechstacks(string $techstackUuid, int $limit): array
    {
        try {
            // Define the SQL query to retrieve techstack information with associated data
            $query = "
                SELECT
                    BIN_TO_UUID(pt.project_id) AS uuid
                FROM
                    project_techstack pt
                WHERE
                    pt.techstack_id = UUID_TO_BIN(:techstack_id)
                LIMIT :limit;
            ";

            // Define the parameters for the query
            $params = [":limit" => $limit, ":techstack_id" => $techstackUuid];
            $paramTypes = [":limit" => PDO::PARAM_INT, ":techstack_id" => PDO::PARAM_STR];

            // Execute the query and return the results
            return $this->fetchAll($query, $params, $paramTypes);
        } catch (Exception $e) {
            // Log the error
            error_log($e->getMessage());

            // Throw an exception to indicate failure
            throw new Exception("getProjectsPerTechstacks");
        }
    }
}
