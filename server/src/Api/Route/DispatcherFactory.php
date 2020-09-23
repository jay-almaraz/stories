<?php

namespace Stories\Api\Route;

use FastRoute\Dispatcher;
use FastRoute\RouteCollector;

use function FastRoute\cachedDispatcher;

/**
 * Factory class for instantiating an API dispatcher using the provided registry of API routes
 */
class DispatcherFactory
{
    private RouteRegistry $routeRegistry;

    public function __construct(RouteRegistry $routeRegistry)
    {
        $this->routeRegistry = $routeRegistry;
    }

    public function getDispatcher(): Dispatcher
    {
        // Utilise a cached dispatcher such that the routes do not need to be parsed on every request
        return cachedDispatcher(
            function (RouteCollector $r): void {
                $this->routeRegistry->addRoutes($r);
            },
            [
                'cacheFile'     => __DIR__ . '/route.cache',
                'cacheDisabled' => true, // Disable cache in production
            ]
        );
    }
}