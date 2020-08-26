<?php

namespace Stories\Api;

use Psr\Log\LoggerInterface;

class HandlerContainer
{
    private LoggerInterface $logger;

    public function __construct(
        LoggerInterface $logger
    ) {
        $this->logger = $logger;
    }

    public function getLogger(): LoggerInterface
    {
        return $this->logger;
    }
}