<?php

namespace Model;

use Exception;
use PDO;

require_once PROJECT_ROOT_PATH . "/Model/DatabaseModel.php";

/**
 * Model class for interacting with the techstack table in the MySQL database.
 */
class TechstackModel extends DatabaseModel
{
    /**
     * Retrieves all techstacks associated with a project.
     *
     * @param array $techstackUuids An array of techstack UUIDs.
     * @return array Formatted techstack data.
     * @throws Exception If an error occurs during execution.
     */
    public function getTechstacksPerProject(array $techstackUuids): array
    {
        try {
            // Check if techstack UUIDs are provided
            if (empty($techstackUuids)) {
                throw new Exception("Techstack UUIDs are empty");
            }
            // Create placeholders for the UUIDs in the SQL query
            $placeholders = implode(', ', array_fill(0, count($techstackUuids), 'UUID_TO_BIN(?)'));

            // Build the SQL query
            $techstackQuery = "SELECT BIN_TO_UUID(uuid) as uuid, name, type, expertise_level FROM techstack WHERE uuid IN ($placeholders)";

            // Execute the SQL query and replace the placeholders with the UUIDs
            $techstackResults = $this->fetchAll($techstackQuery, $techstackUuids);

            // Format the results according to the expected output format
            $formattedResults = [];
            foreach ($techstackResults as $techstackResult) {
                $formattedResults[] = [
                    "uuid" => $techstackResult['uuid'],
                    "name" => $techstackResult['name'],
                    "type" => $techstackResult['type'],
                    "expertise_level" => $techstackResult['expertise_level']
                ];
            }

            return $formattedResults;
        } catch (Exception $e) {
            // Log the error
            error_log($e->getMessage());

            // Throw an exception to indicate failure
            throw new Exception("Failed to retrieve techstacks per project");
        }
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
                    BIN_TO_UUID(t.uuid) as uuid,
                    t.name,
                    (
                        SELECT
                            tt.type
                        FROM
                            techstack_type tt
                        WHERE
                            id=t.type
                    ) as type,
                    t.expertise_level,
                    t.flag_important,
                    (
                        SELECT
                            MAX(COALESCE(p.end_date, CURDATE()))
                        FROM
                            project_dates p
                        JOIN
                            project_techstack pt ON p.project_id = pt.project_id
                        WHERE
                            pt.techstack_id = t.uuid
                    ) AS last_usage_date,
                    COUNT(DISTINCT pt.project_id) AS project_count
                FROM
                    techstack t
                LEFT JOIN
                    project_techstack pt ON t.uuid = pt.techstack_id
                GROUP BY
                    t.uuid, t.name, type, t.expertise_level, t.flag_important
                LIMIT :limit
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
            throw new Exception("Failed to retrieve customers per project");
        }
    }
}
