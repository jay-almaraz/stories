<?php

namespace Stories\Api\Route;

use FastRoute\RouteCollector;
use Stories\Api\Handler\Health\HealthCheckHandler;
use Stories\Api\Http\Method;
use Stories\Domain\Handler\AddCommentHandler;
use Stories\Domain\Handler\AddHeartHandler;
use Stories\Domain\Handler\DeleteHeartHandler;
use Stories\Domain\Handler\GetStoriesHandler;
use Stories\Domain\Handler\GetStoryHandler;
use Stories\Domain\Handler\ShareStoryHandler;

class RouteRegistry
{
    public function addRoutes(RouteCollector $r): void
    {
        $r->addRoute([Method::GET], '/', HealthCheckHandler::class);
        $r->addRoute([Method::GET], '/health-check', HealthCheckHandler::class);

        $r->addRoute([Method::GET], '/stories', GetStoriesHandler::class);
        $r->addRoute([Method::GET], '/story/{id:[0-9]+}', GetStoryHandler::class);
        $r->addRoute([Method::POST], '/stories/share', ShareStoryHandler::class);
        $r->addRoute([Method::POST], '/stories/add-heart', AddHeartHandler::class);
        $r->addRoute([Method::POST], '/stories/delete-heart', DeleteHeartHandler::class);
        $r->addRoute([Method::POST], '/stories/add-comment', AddCommentHandler::class);
    }
}