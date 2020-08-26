<?php

namespace Stories\Api\Handler;

use Stories\Api\HandlerContainer;

abstract class HandlerFactory
{
    protected HandlerContainer $handlerContainer;

    final public function __construct(HandlerContainer $handlerContainer)
    {
        $this->handlerContainer = $handlerContainer;
    }

    /**
     * @param array<string, mixed> $vars
     *
     * @return Handler
     */
    abstract public function getHandler(array $vars): Handler;
}