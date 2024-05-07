<?php

namespace Model;

use Exception;
use PDO;

require_once PROJECT_ROOT_PATH . "/Model/DatabaseModel.php";

/**
 * Model class for interacting with the projects table in the MySQL database.
 */
class ProjectsModel extends DatabaseModel
{
    /**
     * Retrieves a project from the database.
     *
     * @param string $projectUuid The UUID of the project to retrieve.
     * @return array Returns an associative array containing project data.
     * @throws Exception If an error occurs during execution.
     */
    public function getProject(string $projectUuid): array
    {
        try {
            // Define the SQL query to retrieve projects with associated data
            $query = "
                SELECT
                    p.id,
                    BIN_TO_UUID(p.uuid) as uuid,
                    p.name,
                    p.location,
                    p.position,
                    p.content,
                    p.type,
                    GROUP_CONCAT(DISTINCT BIN_TO_UUID(pt.techstack_id)) as techstack_uuids,
                    GROUP_CONCAT(DISTINCT BIN_TO_UUID(pc.customer_id)) as customer_uuids
                FROM
                    projects p
                LEFT JOIN
                    project_techstack pt ON p.uuid = pt.project_id
                LEFT JOIN
                    project_customer pc ON p.uuid = pc.project_id
                WHERE
                    p.uuid = UUID_TO_BIN(:ProjectUuid)
                GROUP BY
                    p.id,
                    uuid,
                    p.name,
                    p.type,
                    p.location,
                    p.position,
                    p.content
            ";

            // Define the parameters for the query
            $params = [":ProjectUuid" => $projectUuid];
            $paramTypes = [":ProjectUuid" => PDO::PARAM_STR];

            // Execute the query and return the results
            return $this->fetch($query, $params, $paramTypes);
        } catch (Exception $e) {
            // Log the error
            error_log($e->getMessage());

            // Throw an exception to indicate failure
            throw new Exception("Failed to retrieve project");
        }
    }

    /**
     * Retrieves projects from the database.
     *
     * @param int $limit The maximum number of projects to retrieve.
     * @return array Returns an array containing project data.
     * @throws Exception If an error occurs during execution.
     */
    public function getProjects(int $limit): array
    {
        try {
            // Define the SQL query to retrieve projects with associated data
            $query = "
                SELECT
                    BIN_TO_UUID(p.uuid) as uuid,
                    (
                    SELECT
                        pt.type
                    FROM
                        project_type pt
                    WHERE
                        id=p.type
                    ) as type,
                    p.name,
                    p.location,
                    p.position,
                    p.content,
                    GROUP_CONCAT(DISTINCT BIN_TO_UUID(pt.techstack_id)) as techstack_uuids,
                    GROUP_CONCAT(DISTINCT BIN_TO_UUID(pc.customer_id)) as customer_uuids
                FROM
                    projects p
                LEFT JOIN
                    project_techstack pt ON p.uuid = pt.project_id
                LEFT JOIN
                    project_customer pc ON p.uuid = pc.project_id
                GROUP BY
                    p.uuid,
                    p.type,
                    p.name,
                    p.location,
                    p.position,
                    p.content
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
            throw new Exception("Failed to retrieve projects");
        }
    }
}
