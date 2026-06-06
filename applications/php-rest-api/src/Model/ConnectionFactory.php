<?php

namespace Model;

use Inc\Config;
use PDO;
use PDOException;
use Exception;

/**
 * Provides a shared PDO connection per HTTP request.
 */
class ConnectionFactory
{
    private static ?PDO $connection = null;

    public static function getConnection(): PDO
    {
        if (self::$connection === null) {
            self::$connection = self::createConnection();
        }

        return self::$connection;
    }

    public static function reset(): void
    {
        self::$connection = null;
    }

    /**
     * @throws Exception
     */
    private static function createConnection(): PDO
    {
        try {
            $pdo = new PDO(
                'mysql:host=' . Config::$dbHost
                . ';port=' . Config::$dbPort
                . ';dbname=' . Config::$dbDatabaseName
                . ';charset=utf8mb4',
                Config::$dbUsername,
                Config::$dbPassword,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]
            );

            return $pdo;
        } catch (PDOException $exception) {
            throw new Exception($exception->getMessage(), (int) $exception->getCode(), $exception);
        }
    }
}
