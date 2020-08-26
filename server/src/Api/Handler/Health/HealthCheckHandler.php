<?php

namespace Stories\Api\Handler\Health;

use Stories\Api\Handler\Handler;
use Stories\Api\Http\Response;
use Stories\Api\Http\StatusCode;

class HealthCheckHandler implements Handler
{
    public function handle(): Response
    {
        return new Response(StatusCode::OK, ['healthy' => true]);
    }
}