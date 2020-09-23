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
        // Connect to DB
        $dbConnection = DbConnectionFactory::getConnection();

        // Extract params
        $id = mysqli_real_escape_string($dbConnection, $this->vars['id']);

        // Fetch desired story
        $stories = $dbConnection->query(
            'SELECT 
            stories.*, COUNT(story_hearts.id) AS hearts
            FROM stories 
            LEFT JOIN story_hearts ON stories.id = story_hearts.story_id 
            WHERE approved = 1 
            AND stories.id = "' . $id . '"
            GROUP BY stories.id;'
        );
        if (!($stories instanceof mysqli_result)) {
            return new Response(StatusCode::INTERNAL_SERVER_ERROR);
        }

        // Fetch accompanying comments for desired story
        $comments = $dbConnection->query(
            'SELECT 
            comment, datetime, name
            FROM story_comments 
            WHERE story_id = "' . $id . '"
            ORDER BY datetime'
        );
        if (!($comments instanceof mysqli_result)) {
            return new Response(StatusCode::INTERNAL_SERVER_ERROR);
        }

        // Combine fetched data and respond
        $story = $stories->fetch_assoc();
        $story['comments'] = $comments->fetch_all(MYSQLI_ASSOC);

        return new Response(StatusCode::OK, $story);
    }
}