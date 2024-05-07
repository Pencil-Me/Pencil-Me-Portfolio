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
    public function getDatesPerProject(string $projectUuid): array
    {
        try {
            // Check if project UUIDs are provided
            if (empty($projectUuid)) {
                throw new Exception("Project UUID is empty");
            }

            // Build the SQL query
            $datesQuery = "SELECT start_date, end_date FROM project_dates WHERE project_id=UUID_TO_BIN('$projectUuid')";

            // Execute the SQL query and replace the placeholders with the UUIDs
            $datesResults = $this->fetchAll($datesQuery);

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
