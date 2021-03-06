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
        // Connect to DB and instantiate processors
        $dbConnection = DbConnectionFactory::getConnection();
        $inputProcessor = new InputProcessor();

        // Extract params
        $params = $inputProcessor->getDecodedJsonBody();
        $storyId = $params['storyId'];
        $sessionId = $params['sessionId'];

        // Prepare DB DELETE statement
        $dbStatement = $dbConnection->prepare(
            'DELETE FROM story_hearts WHERE story_id = ? AND session_id = ?;'
        );

        // Check for valid statement preparation
        if ($dbStatement === false) {
            throw new DbException('Unable to prepare statement: ' . $dbConnection->error);
        }

        // Bind params to DB statement
        $dbBind = $dbStatement->bind_param('is', $storyId, $sessionId);

        // Check for valid statement bindings
        if ($dbBind === false || $dbStatement->execute() === false) {
            throw new DbException('Unable to delete heart: ' . $dbStatement->error);
        }

        // Success
        return new Response(StatusCode::OK);
    }
}