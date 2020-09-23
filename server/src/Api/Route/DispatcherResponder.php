<?php

namespace Stories\Api\Route;

use FastRoute\Dispatcher;
use Stories\Api\Http\Response;
use Stories\Api\Http\StatusCode;

/**
 * Class used to process the results of a dispatched API request
 */
class DispatcherResponder
{
    private DispatcherFoundResponder $dispatcherFoundResponder;

    public function __construct(DispatcherFoundResponder $dispatcherFoundResponder)
    {
        $this->dispatcherFoundResponder = $dispatcherFoundResponder;
    }

    /**
     * Process the route information identified by the dispatch of the router
     * Return a 404 if the route is not found
     * Return a 405 if the method for the route is incorrect
     * Dispatch to the route found responder if there is a match
     * Fallback to returning a 500 if none of the above criteria is met
     *
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
                // Extract required route info for further processing
                /** @var string $handlerFactoryClass */
                /** @var array<mixed> $vars */
                [, $handlerFactoryClass, $vars] = $routeInfo;
                return $this->dispatcherFoundResponder->respond($handlerFactoryClass, $vars);
            default:
                return new Response(StatusCode::INTERNAL_SERVER_ERROR);
        }
    }
}