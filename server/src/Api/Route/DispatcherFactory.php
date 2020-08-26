<?php

namespace Stories\Api\Route;

use FastRoute\Dispatcher;
use FastRoute\RouteCollector;

use function FastRoute\cachedDispatcher;

class DispatcherFactory
{
    private RouteRegistry $routeRegistry;

    public function __construct(RouteRegistry $routeRegistry)
    {
        $this->routeRegistry = $routeRegistry;
    }

    public function getDispatcher(): Dispatcher
    {
        return cachedDispatcher(
            function (RouteCollector $r): void {
                $this->routeRegistry->addRoutes($r);
            },
            [
                'cacheFile'     => __DIR__ . '/route.cache',
                'cacheDisabled' => true,
            ]
        );
    }
}