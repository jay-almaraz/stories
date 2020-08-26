<?php

namespace Stories\Api\Route;

use Stories\Api\Handler\HandlerFactory;
use Stories\Api\HandlerContainer;
use Stories\Api\Http\Response;
use Stories\Api\Http\StatusCode;
use Throwable;

class DispatcherFoundResponder
{
    private HandlerContainer $handlerContainer;

    public function __construct(HandlerContainer $handlerContainer)
    {
        $this->handlerContainer = $handlerContainer;
    }

    /**
     * @param string       $handlerFactoryClass
     * @param array<mixed> $vars
     *
     * @return Response
     */
    public function respond(string $handlerFactoryClass, array $vars): Response
    {
        if (is_subclass_of($handlerFactoryClass, HandlerFactory::class)) {
            return $this->handlerFactoryRespond($handlerFactoryClass, $vars);
        }

        return new Response(StatusCode::INTERNAL_SERVER_ERROR);
    }

    /**
     * @param string       $handlerFactoryClass
     * @param array<mixed> $vars
     *
     * @return Response
     *
     * @phpstan-param class-string<HandlerFactory> $handlerFactoryClass
     */
    private function handlerFactoryRespond(string $handlerFactoryClass, array $vars): Response
    {
        try {
            /** @var HandlerFactory $handlerFactory */
            $handlerFactory = new $handlerFactoryClass($this->handlerContainer);
            $handler = $handlerFactory->getHandler($vars);
            return $handler->handle();
        } catch (Throwable $e) {
            $this->logUncaughtException($handlerFactoryClass, $vars, $e);
            return new Response(StatusCode::INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @param string       $handlerFactoryClass
     * @param array<mixed> $vars
     * @param Throwable    $e
     */
    private function logUncaughtException(string $handlerFactoryClass, array $vars, Throwable $e): void
    {
        $logger = $this->handlerContainer->getLogger();
        $logger->error(
            'Uncaught exception in handler',
            [
                'handler' => $handlerFactoryClass,
                'vars'    => $vars,
                'message' => $e->getMessage(),
                'trace'   => $e->getTraceAsString(),
            ]
        );
    }
}