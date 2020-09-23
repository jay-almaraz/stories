<?php

/**
 * Entrypoint to the stories API
 * All API requests are forwarded to this script
 */

use Monolog\Handler\StreamHandler;
use Monolog\Logger;
use Stories\Api\ApiBootstrap;
use Stories\Api\Http\ServerProcessor;

require '../vendor/autoload.php';

// Ensure entirety of script is wrapped to prevent leaks of any errors
try {
    // Establish logging protocols
    $logger = new Logger('api');
    $logger->pushHandler(new StreamHandler('php://stdout', Logger::DEBUG));

    // Bootstrap API and respond to requests
    $serverProcessor = new ServerProcessor();
    (new ApiBootstrap($logger, $serverProcessor))->respond();
} catch (Throwable $e) {
    // Return 500 on any uncaught exception
    http_response_code(500);

    // Log uncaught exception if possible
    if (isset($logger)) {
        $logger->error(
            'Uncaught exception in API',
            [
                'message' => $e->getMessage(),
                'trace'   => $e->getTraceAsString(),
            ]
        );
    }
}