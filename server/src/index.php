<?php

use Monolog\Handler\StreamHandler;
use Monolog\Logger;
use Stories\Api\ApiBootstrap;
use Stories\Api\Http\ServerProcessor;

require '../vendor/autoload.php';

try {
    $logger = new Logger('api');
    $logger->pushHandler(new StreamHandler('php://stdout', Logger::DEBUG));

    $serverProcessor = new ServerProcessor();
    (new ApiBootstrap($logger, $serverProcessor))->respond();
} catch (Throwable $e) {
    http_response_code(500);

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