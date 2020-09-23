<?php

namespace Stories\Api\Handler;

use Psr\Log\LoggerInterface;
use Stories\Api\Http\Response;

/**
 * Abstract handler implementation providing the basis of all API request handlers
 */
abstract class Handler
{
    protected LoggerInterface $logger;
    /** @var array<mixed> */
    protected array $vars;

    /**
     * Ensure the constructor is final such that all handlers can be optimistically instantiated using their classname
     * @see https://www.php.net/manual/en/language.namespaces.dynamic.php
     *
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