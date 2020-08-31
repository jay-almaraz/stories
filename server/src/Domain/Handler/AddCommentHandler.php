<?php

namespace Stories\Domain\Handler;

use mysqli_result;
use Stories\Api\Handler\Handler;
use Stories\Api\Http\HttpException;
use Stories\Api\Http\InputProcessor;
use Stories\Api\Http\Response;
use Stories\Api\Http\StatusCode;
use Stories\Metal\Db\DbConnectionFactory;
use Stories\Metal\Db\DbException;

class AddCommentHandler extends Handler
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
        $comment = $params['comment'];
        $name = $params['name'] ?? null;

        $dbStatement = $dbConnection->prepare(
            'INSERT INTO story_comments (story_id, datetime, session_id, comment, name)
            VALUES (?, NOW(), ?, ?, ?);'
        );

        if ($dbStatement === false) {
            throw new DbException('Unable to prepare statement: ' . $dbConnection->error);
        }

        $dbBind = $dbStatement->bind_param('isss', $storyId, $sessionId, $comment, $name);

        if ($dbBind === false || $dbStatement->execute() === false) {
            throw new DbException('Unable to add comment: ' . $dbStatement->error);
        }

        $comment = $dbConnection->query(
            'SELECT 
            comment, datetime, name
            FROM story_comments 
            WHERE id = "' . $dbConnection->insert_id . '"'
        );
        if (!($comment instanceof mysqli_result)) {
            return new Response(StatusCode::INTERNAL_SERVER_ERROR);
        }

        return new Response(StatusCode::OK, $comment->fetch_assoc());
    }
}