<?php

namespace Stories\Api\Handler;

use Psr\Log\LoggerInterface;
use Stories\Api\Http\Response;

abstract class Handler
{
    protected LoggerInterface $logger;

    final public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    abstract public function handle(): Response;
}