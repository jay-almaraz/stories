<?php

namespace Stories\Metal\Db;

use mysqli;

/**
 * Factory class for instantiating a database connection
 */
class DbConnectionFactory
{
    /**
     * @return mysqli
     * @throws DbException
     */
    public static function getConnection(): mysqli
    {
        // Connect using the DbConfig class as config
        $dbConnection = mysqli_connect(
            DbConfig::HOST,
            DbConfig::USER,
            DbConfig::PASS,
            DbConfig::DB,
            DbConfig::PORT
        );

        // Ensure successful connection
        if ($dbConnection === false || $dbConnection->connect_errno !== 0) {
            throw new DbException('Unable to connect to DB: ' . mysqli_connect_error());
        }

        return $dbConnection;
    }
}