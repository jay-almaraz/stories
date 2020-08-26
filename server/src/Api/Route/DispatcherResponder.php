<?php

namespace Stories\Api\Route;

use FastRoute\Dispatcher;
use Stories\Api\Http\Response;
use Stories\Api\Http\StatusCode;

class DispatcherResponder
{
    private DispatcherFoundResponder $dispatcherFoundResponder;

    public function __construct(DispatcherFoundResponder $dispatcherFoundResponder)
    {
        $this->dispatcherFoundResponder = $dispatcherFoundResponder;
    }

    /**
     * @param array<int|string|array> $routeInfo
     *
     * @return Response
     *
     * @see Dispatcher::dispatch
     */
    public function process(array $routeInfo): Response
    {
        /** @var int $routeStatus */
        $routeStatus = $routeInfo[0];
        switch ($routeStatus) {
            case Dispatcher::NOT_FOUND:
                return new Response(StatusCode::NOT_FOUND);
            case Dispatcher::METHOD_NOT_ALLOWED:
                return new Response(StatusCode::METHOD_NOT_ALLOWED);
            case Dispatcher::FOUND:
                /** @var string $handlerFactoryClass */
                /** @var array<mixed> $vars */
                [, $handlerFactoryClass, $vars] = $routeInfo;
                return $this->dispatcherFoundResponder->respond($handlerFactoryClass, $vars);
            default:
                return new Response(StatusCode::INTERNAL_SERVER_ERROR);
        }
    }
}