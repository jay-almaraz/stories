<?php

namespace Stories\Metal\Db;

use mysqli;

class DbConnectionFactory
{
    /**
     * @return mysqli
     * @throws DbException
     */
    public static function getConnection(): mysqli
    {
        $dbConnection = mysqli_connect(
            DbConfig::HOST,
            DbConfig::USER,
            DbConfig::PASS,
            DbConfig::DB,
            DbConfig::PORT
        );

        if ($dbConnection === false || $dbConnection->connect_errno !== 0) {
            throw new DbException('Unable to connect to DB: ' . mysqli_connect_error());
        }

        return $dbConnection;
    }
}