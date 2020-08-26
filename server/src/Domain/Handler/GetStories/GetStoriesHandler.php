<?php

namespace Stories\Domain\Handler\GetStories;

use mysqli_result;
use Stories\Api\Handler\Handler;
use Stories\Api\Http\Response;
use Stories\Api\Http\StatusCode;
use Stories\Metal\Db\DbConnectionFactory;
use Stories\Metal\Db\DbException;

class GetStoriesHandler implements Handler
{
    /**
     * @return Response
     * @throws DbException
     */
    public function handle(): Response
    {
        $dbConnection = DbConnectionFactory::getConnection();
        $stories = $dbConnection->query('SELECT * FROM stories;');
        if (!($stories instanceof mysqli_result)) {
            return new Response(StatusCode::INTERNAL_SERVER_ERROR);
        }

        return new Response(StatusCode::OK, $stories->fetch_all(MYSQLI_ASSOC));
    }
}