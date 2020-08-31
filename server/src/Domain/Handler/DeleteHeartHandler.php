<?php

namespace Stories\Domain\Handler;

use Stories\Api\Handler\Handler;
use Stories\Api\Http\HttpException;
use Stories\Api\Http\InputProcessor;
use Stories\Api\Http\Response;
use Stories\Api\Http\StatusCode;
use Stories\Metal\Db\DbConnectionFactory;
use Stories\Metal\Db\DbException;

class DeleteHeartHandler extends Handler
{
    /**
     * @return Response
     * @throws DbException
     * @throws HttpException
     */
    public function handle(): Response
    {
        $dbConnection = DbConnectionFactory::getConnection();
        $inputProcessor = new InputProcessor();

        $params = $inputProcessor->getDecodedJsonBody();
        $storyId = $params['storyId'];
        $sessionId = $params['sessionId'];

        $dbStatement = $dbConnection->prepare(
            'DELETE FROM story_hearts WHERE story_id = ? AND session_id = ?;'
        );

        if ($dbStatement === false) {
            throw new DbException('Unable to prepare statement: ' . $dbConnection->error);
        }

        $dbBind = $dbStatement->bind_param('is', $storyId, $sessionId);

        if ($dbBind === false || $dbStatement->execute() === false) {
            throw new DbException('Unable to delete heart: ' . $dbStatement->error);
        }

        return new Response(StatusCode::OK);
    }
}