<?php

namespace Stories\Api\Handler;

use Stories\Api\Http\Response;

interface Handler
{
    public function handle(): Response;
}