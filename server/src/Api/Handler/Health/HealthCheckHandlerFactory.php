<?php

namespace Stories\Api\Handler\Health;

use Stories\Api\Handler\Handler;
use Stories\Api\Handler\HandlerFactory;

class HealthCheckHandlerFactory extends HandlerFactory
{
    public function getHandler(array $vars): Handler
    {
        return new HealthCheckHandler();
    }
}