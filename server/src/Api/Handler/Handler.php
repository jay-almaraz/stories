<?php

namespace Stories\Api\Handler;

use Psr\Log\LoggerInterface;
use Stories\Api\Http\Response;

abstract class Handler
{
    protected LoggerInterface $logger;
    /** @var array<mixed> */
    protected array $vars;

    /**
     * @param LoggerInterface $logger
     * @param array<mixed>    $vars
     */
    final public function __construct(LoggerInterface $logger, array $vars)
    {
        $this->logger = $logger;
        $this->vars = $vars;
    }

    abstract public function handle(): Response;
}