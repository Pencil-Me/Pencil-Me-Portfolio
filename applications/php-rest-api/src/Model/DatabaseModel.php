<?php

namespace Model;

use Inc\Config;
use Exception;
use PDO;
use PDOException;
use PDOStatement;

/**
 * The DatabaseModel class provides methods to interact with the underlying MySQL database.
 */
class DatabaseModel
{
    /** @var PDO|null The database connection object. */
    protected ?PDO $connection = null;

    /**
     * Constructor to initialize the database connection.
     *
     * @throws Exception If unable to establish a database connection.
     */
    public function __construct()
    {
        try {
            // Establish a database connection
            $this->connection = new PDO(
                "mysql:host=" . Config::$dbHost . ";port=" . Config::$dbPort . ";dbname=" . Config::$dbDatabaseName,
                Config::$dbUsername,
                Config::$dbPassword
            );

            // Set character encoding
            $this->connection->exec("set names utf8");
        } catch (PDOException $exception) {
            // If connection fails, throw an exception
            throw new Exception($exception->getMessage());
        }
    }

    /**
     * Fetches a single row from the database.
     *
     * @param string $query The SQL query to execute.
     * @param array $params An associative array of parameters for the query.
     * @param array $paramTypes An associative array specifying the parameter types.
     * @return array|false Returns the fetched row as an associative array, or false on failure.
     * @throws Exception If an error occurs during execution.
     */
    public function fetch(string $query = "", array $params = [], array $paramTypes = []): array|false
    {
        try {
            $stmt = $this->executeStatement($query, $params, $paramTypes);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (Exception $exception) {
            // If an error occurs during execution, throw an exception
            throw new Exception($exception->getMessage());
        }
    }

    /**
     * Fetches all rows from the database.
     *
     * @param string $query The SQL query to execute.
     * @param array $params An associative array of parameters for the query.
     * @param array $paramTypes An associative array specifying the parameter types.
     * @return array|false Returns an array containing all fetched rows, or false on failure.
     * @throws Exception If an error occurs during execution.
     */
    public function fetchAll(string $query = "", array $params = [], array $paramTypes = []): array|false
    {
        try {
            $stmt = $this->executeStatement($query, $params, $paramTypes);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $exception) {
            // If an error occurs during execution, throw an exception
            throw new Exception($exception->getMessage());
        }
    }

    /**
     * Executes a prepared statement with the given parameters.
     *
     * @param string $query The SQL query to prepare and execute.
     * @param array $params An associative array of parameters for the query.
     * @param array $paramTypes An associative array specifying the parameter types.
     * @return PDOStatement Returns the PDOStatement object representing the prepared statement.
     * @throws Exception If an error occurs during execution.
     */
    private function executeStatement(string $query = "", array $params = [], array $paramTypes = []): PDOStatement
    {
        try {
            // Prepare the SQL query
            $stmt = $this->connection->prepare($query);

            if ($stmt === false) {
                throw new Exception("Unable to prepare statement: " . $query);
            }

            // Bind parameters
            foreach ($params as $index => &$paramValue) {
                $paramType = $paramTypes[$index] ?? PDO::PARAM_STR;
                $stmt->bindParam($index + 1, $paramValue, $paramType);
            }

            // Execute the statement
            $stmt->execute();
            return $stmt;
        } catch (Exception $exception) {
            error_log($exception->getMessage());
            throw new Exception("Database query execution failed");
        }
    }
}
