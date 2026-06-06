<?php

namespace Model;

use Exception;
use PDO;

/**
 * Model class for interacting with the customers table in the MySQL database.
 */
class CustomersModel extends DatabaseModel
{
    /**
     * Retrieves customer rows keyed by UUID for batch project enrichment.
     *
     * @param array<int, string> $customerUuids
     * @return array<string, array<string, mixed>>
     * @throws Exception
     */
    public function getCustomersByUuids(array $customerUuids): array
    {
        if ($customerUuids === []) {
            return [];
        }

        $customerResults = $this->fetchCustomerRows($customerUuids);
        $byUuid = [];

        foreach ($customerResults as $customerResult) {
            $byUuid[$customerResult['uuid']] = [
                'uuid' => $customerResult['uuid'],
                'name' => $customerResult['name'],
                'location' => $customerResult['location'],
            ];
        }

        return $byUuid;
    }

    /**
     * Retrieves customers associated with a project from the database.
     *
     * @param array<int, string> $customerUuids The UUIDs of customers associated with the project.
     * @return array<int, array<string, mixed>> The array of formatted customer data.
     * @throws Exception If an error occurs during the database operation.
     */
    public function getCustomersPerProject(array $customerUuids): array
    {
        if ($customerUuids === []) {
            return [];
        }

        try {
            $customerResults = $this->fetchCustomerRows($customerUuids);
            $formattedResults = [];

            foreach ($customerResults as $customerResult) {
                $formattedResults[] = [
                    'uuid' => $customerResult['uuid'],
                    'name' => $customerResult['name'],
                    'location' => $customerResult['location'],
                ];
            }

            return $formattedResults;
        } catch (Exception $e) {
            error_log($e->getMessage());
            throw new Exception('Failed to retrieve customers per project', 0, $e);
        }
    }

    /**
     * @param array<int, string> $customerUuids
     * @return array<int, array<string, mixed>>
     * @throws Exception
     */
    private function fetchCustomerRows(array $customerUuids): array
    {
        $placeholders = implode(', ', array_fill(0, count($customerUuids), 'UUID_TO_BIN(?)'));
        $customerQuery = "SELECT BIN_TO_UUID(uuid) as uuid, name, location FROM customers WHERE uuid IN ($placeholders)";
        return $this->fetchAll($customerQuery, $customerUuids);
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
