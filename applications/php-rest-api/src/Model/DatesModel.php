<?php

namespace Model;

use Exception;
use PDO;

require_once PROJECT_ROOT_PATH . "/Model/DatabaseModel.php";

/**
 * Model class for interacting with the dates table in the MySQL database.
 */
class DatesModel extends DatabaseModel
{
    /**
     * Retrieves dates associated with a project from the database.
     *
     * @param string $projectUuid The UUID of the project.
     * @return array The array of formatted date data.
     * @throws Exception If an error occurs during the database operation.
     */
    public function getDatesPerProject(array $projectUuids): array
    {
        try {
            // Check if project UUIDs are provided
            if (empty($projectUuids)) {
                throw new Exception("Project UUID is empty");
            }

            // Create placeholders for the UUIDs in the SQL query
            $placeholders = implode(', ', array_fill(0, count($projectUuids), 'UUID_TO_BIN(?)'));

            // Build the SQL query
            $datesQuery = "SELECT start_date, end_date FROM project_dates WHERE project_id IN ($placeholders)";

            // Execute the SQL query and replace the placeholders with the UUIDs
            $datesResults = $this->fetchAll($datesQuery, $projectUuids);

            // Format the results according to the expected output format
            $formattedResults = [];
            foreach ($datesResults as $datesResult) {
                $formattedResults[] = [
                    "start_date" => $datesResult['start_date'],
                    "end_date" => $datesResult['end_date']
                ];
            }

            return $formattedResults;
        } catch (Exception $e) {
            // Log the error
            error_log($e->getMessage());

            // Throw an exception to indicate failure
            throw new Exception("Failed to retrieve dates per project");
        }
    }
}
