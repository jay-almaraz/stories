<?php

namespace Stories\Api\Handler\Health;

use Stories\Api\Handler\Handler;
use Stories\Api\Http\Response;
use Stories\Api\Http\StatusCode;

/**
 * API request handler used to ensure the liveness of the API
 */
class HealthCheckHandler extends Handler
{
    public function handle(): Response
    {
        return new Response(StatusCode::OK, ['healthy' => true]);
    }
}