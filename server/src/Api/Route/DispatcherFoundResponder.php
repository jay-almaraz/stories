<?php

namespace Stories\Api\Route;

use Psr\Log\LoggerInterface;
use Stories\Api\Handler\Handler;
use Stories\Api\Http\Response;
use Stories\Api\Http\StatusCode;
use Throwable;

class DispatcherFoundResponder
{
    private LoggerInterface $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    /**
     * @param string       $handlerClass
     * @param array<mixed> $vars
     *
     * @return Response
     */
    public function respond(string $handlerClass, array $vars): Response
    {
        if (is_subclass_of($handlerClass, Handler::class)) {
            return $this->handlerRespond($handlerClass, $vars);
        }

        return new Response(StatusCode::INTERNAL_SERVER_ERROR);
    }

    /**
     * @param string       $handlerClass
     * @param array<mixed> $vars
     *
     * @return Response
     *
     * @phpstan-param class-string<Handler> $handlerClass
     */
    private function handlerRespond(string $handlerClass, array $vars): Response
    {
        try {
            /** @var Handler $handler */
            $handler = new $handlerClass($this->logger);
            return $handler->handle();
        } catch (Throwable $e) {
            $this->logUncaughtException($handlerClass, $vars, $e);
            return new Response(StatusCode::INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @param string       $handlerClass
     * @param array<mixed> $vars
     * @param Throwable    $e
     */
    private function logUncaughtException(string $handlerClass, array $vars, Throwable $e): void
    {
        $this->logger->error(
            'Uncaught exception in handler',
            [
                'handler' => $handlerClass,
                'vars'    => $vars,
                'message' => $e->getMessage(),
                'trace'   => $e->getTraceAsString(),
            ]
        );
    }
}