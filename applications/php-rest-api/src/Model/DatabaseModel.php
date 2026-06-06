<?php

namespace Model;

use Exception;
use PDO;
use PDOStatement;

/**
 * The DatabaseModel class provides methods to interact with the underlying MySQL database.
 */
class DatabaseModel
{
    protected PDO $connection;

    /**
     * @throws Exception
     */
    public function __construct(?PDO $connection = null)
    {
        $this->connection = $connection ?? ConnectionFactory::getConnection();
    }

    /**
     * @param array<string|int, mixed> $params
     * @param array<string|int, int> $paramTypes
     * @return array<string, mixed>|false
     * @throws Exception
     */
    public function fetch(string $query = '', array $params = [], array $paramTypes = []): array|false
    {
        try {
            $stmt = $this->executeStatement($query, $params, $paramTypes);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            return $row === false ? false : $row;
        } catch (Exception $exception) {
            throw new Exception($exception->getMessage(), (int) $exception->getCode(), $exception);
        }
    }

    /**
     * @param array<string|int, mixed> $params
     * @param array<string|int, int> $paramTypes
     * @return array<int, array<string, mixed>>
     * @throws Exception
     */
    public function fetchAll(string $query = '', array $params = [], array $paramTypes = []): array
    {
        try {
            $stmt = $this->executeStatement($query, $params, $paramTypes);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return $rows;
        } catch (Exception $exception) {
            throw new Exception($exception->getMessage(), (int) $exception->getCode(), $exception);
        }
    }

    /**
     * @param array<string|int, mixed> $params
     * @param array<string|int, int> $paramTypes
     * @throws Exception
     */
    private function executeStatement(string $query = '', array $params = [], array $paramTypes = []): PDOStatement
    {
        try {
            $stmt = $this->connection->prepare($query);

            if ($stmt === false) {
                throw new Exception('Unable to prepare statement: ' . $query);
            }

            foreach ($params as $key => &$paramValue) {
                $paramType = $paramTypes[$key] ?? PDO::PARAM_STR;
                $placeholder = is_int($key) ? $key + 1 : $key;
                $stmt->bindParam($placeholder, $paramValue, $paramType);
            }

            $stmt->execute();

            return $stmt;
        } catch (Exception $exception) {
            error_log($exception->getMessage());
            throw new Exception('Database query execution failed', (int) $exception->getCode(), $exception);
        }
    }
}
