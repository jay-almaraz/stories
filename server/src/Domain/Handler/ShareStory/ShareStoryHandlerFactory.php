<?php

namespace Stories\Domain\Handler\ShareStory;

use Stories\Api\Handler\Handler;
use Stories\Api\Handler\HandlerFactory;

class ShareStoryHandlerFactory extends HandlerFactory
{
    public function getHandler(array $vars): Handler
    {
        return new ShareStoryHandler();
    }
}