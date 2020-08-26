<?php

namespace Stories\Api\Route;

use FastRoute\RouteCollector;
use Stories\Api\Handler\Health\HealthCheckHandlerFactory;
use Stories\Api\Http\Method;
use Stories\Domain\Handler\GetStories\GetStoriesHandlerFactory;
use Stories\Domain\Handler\ShareStory\ShareStoryHandlerFactory;

class RouteRegistry
{
    public function addRoutes(RouteCollector $r): void
    {
        $r->addRoute([Method::GET], '/', HealthCheckHandlerFactory::class);
        $r->addRoute([Method::GET], '/health-check', HealthCheckHandlerFactory::class);

        $r->addRoute([Method::GET], '/stories', GetStoriesHandlerFactory::class);
        $r->addRoute([Method::POST], '/stories/share', ShareStoryHandlerFactory::class);
    }
}