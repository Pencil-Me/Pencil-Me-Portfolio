<?php

namespace Model;

use Exception;
use PDO;

require_once PROJECT_ROOT_PATH . "/Model/DatabaseModel.php";

/**
 * Model class for interacting with the customers table in the MySQL database.
 */
class CustomersModel extends DatabaseModel
{
    /**
     * Retrieves customers associated with a project from the database.
     *
     * @param array $customerUuids The UUIDs of customers associated with the project.
     * @return array The array of formatted customer data.
     * @throws Exception If an error occurs during the database operation.
     */
    public function getCustomersPerProject(array $customerUuids): array
    {
        try {
            // Check if customer UUIDs are provided
            if (empty($customerUuids)) {
                throw new Exception("Customer UUIDs are empty");
            }

            // Create placeholders for the UUIDs in the SQL query
            $placeholders = implode(', ', array_fill(0, count($customerUuids), 'UUID_TO_BIN(?)'));

            // Build the SQL query
            $customerQuery = "SELECT BIN_TO_UUID(uuid) as uuid, name, location FROM customers WHERE uuid IN ($placeholders)";

            // Execute the SQL query and replace the placeholders with the UUIDs
            $customerResults = $this->fetchAll($customerQuery, $customerUuids);

            // Format the results according to the expected output format
            $formattedResults = [];
            foreach ($customerResults as $customerResult) {
                $formattedResults[] = [
                    "uuid" => $customerResult['uuid'],
                    "name" => $customerResult['name'],
                    "location" => $customerResult['location']
                ];
            }

            return $formattedResults;
        } catch (Exception $e) {
            // Log the error
            error_log($e->getMessage());

            // Throw an exception to indicate failure
            throw new Exception("Failed to retrieve customers per project");
        }
    }

    /**
     * Retrieves customers from the database.
     *
     * @param int $limit The maximum number of customers to retrieve.
     * @return array The array of customer data.
     * @throws Exception
     */
    public function getCustomers(int $limit): array
    {
        try {
            // Construct the SQL query
            $query = "
                SELECT
                    BIN_TO_UUID(c.uuid) as uuid,
                    c.name,
                    c.location,
                    MAX(pd.end_date) AS last_used_date
                FROM
                    customers c
                LEFT JOIN
                    project_customer pc ON c.uuid = pc.customer_id
                LEFT JOIN
                    project_dates pd ON pc.project_id = pd.project_id
                GROUP BY
                    c.uuid,
                    c.name,
                    c.location
                LIMIT :limit
            ";

            // Define parameters and their types
            $params = [":limit" => $limit];
            $paramTypes = [":limit" => PDO::PARAM_INT];

            // Fetch data from the database
            return $this->fetchAll($query, $params, $paramTypes);
        } catch (Exception $e) {
            // Log the error
            error_log($e->getMessage());

            // Throw an exception to indicate failure
            throw new Exception("Failed to retrieve customers");
        }
    }
}
