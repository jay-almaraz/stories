<?php

namespace Stories\Domain\Handler;

use mysqli_result;
use Stories\Api\Handler\Handler;
use Stories\Api\Http\Response;
use Stories\Api\Http\StatusCode;
use Stories\Metal\Db\DbConnectionFactory;
use Stories\Metal\Db\DbException;

class GetStoryHandler extends Handler
{
    /**
     * @return Response
     * @throws DbException
     */
    public function handle(): Response
    {
        $dbConnection = DbConnectionFactory::getConnection();
        $id = mysqli_real_escape_string($dbConnection, $this->vars['id']);
        $stories = $dbConnection->query('SELECT * FROM stories WHERE approved = 1 AND id = "' . $id . '";');
        if (!($stories instanceof mysqli_result)) {
            return new Response(StatusCode::INTERNAL_SERVER_ERROR);
        }

        return new Response(StatusCode::OK, $stories->fetch_assoc());
    }
}