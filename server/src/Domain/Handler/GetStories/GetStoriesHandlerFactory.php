<?php

namespace Stories\Domain\Handler\GetStories;

use Stories\Api\Handler\Handler;
use Stories\Api\Handler\HandlerFactory;

class GetStoriesHandlerFactory extends HandlerFactory
{
    public function getHandler(array $vars): Handler
    {
        return new GetStoriesHandler();
    }
}