<?php

namespace Stories\Api;

use FastRoute\Dispatcher;
use Psr\Log\LoggerInterface;
use Stories\Api\Http\HttpException;
use Stories\Api\Http\InputProcessor;
use Stories\Api\Http\ResponseSender;
use Stories\Api\Http\ServerProcessor;
use Stories\Api\Log\ApiRequestLogger;
use Stories\Api\Route\DispatcherFactory;
use Stories\Api\Route\DispatcherFoundResponder;
use Stories\Api\Route\DispatcherResponder;
use Stories\Api\Route\RouteRegistry;

/**
 * Bootstrap the API architecture by instantiating, injecting, and executing the appropriate components
 */
class ApiBootstrap
{
    private LoggerInterface $logger;
    private ServerProcessor $serverProcessor;

    public function __construct(
        LoggerInterface $logger,
        ServerProcessor $serverProcessor
    ) {
        $this->logger = $logger;
        $this->serverProcessor = $serverProcessor;
    }

    /**
     * Respond to the current API request
     *
     * @throws HttpException
     */
    public function respond(): void
    {
        $dispatcher = $this->getDispatcher();
        $dispatcherResponder = $this->getDispatcherResponder();

        $this->logRequest();
        $this->sendResponse($dispatcher, $dispatcherResponder);
    }

    /**
     * Create a dispatcher for the API
     *
     * @return Dispatcher
     */
    private function getDispatcher(): Dispatcher
    {
        $routeRegistry = new RouteRegistry();
        $dispatcherFactory = new DispatcherFactory($routeRegistry);
        return $dispatcherFactory->getDispatcher();
    }

    /**
     * Create a dispatcher responder for incoming API requests
     *
     * @return DispatcherResponder
     */
    private function getDispatcherResponder(): DispatcherResponder {
        return new DispatcherResponder(
            new DispatcherFoundResponder(
                $this->logger
            )
        );
    }

    /**
     * Log the current API request
     */
    private function logRequest(): void
    {
        $apiRequestLogger = new ApiRequestLogger();
        $inputProcessor = new InputProcessor();
        $apiRequestLogger->logRequest(
            $this->logger,
            $this->serverProcessor,
            $inputProcessor
        );
    }

    /**
     * Send an appropriate response back to the origin of the current API request
     *
     * @param Dispatcher          $dispatcher
     * @param DispatcherResponder $dispatcherResponder
     *
     * @throws HttpException
     */
    private function sendResponse(Dispatcher $dispatcher, DispatcherResponder $dispatcherResponder): void
    {
        $routeInfo = $dispatcher->dispatch(
            $this->serverProcessor->getHttpMethod(),
            $this->serverProcessor->getBaseUri()
        );
        $response = $dispatcherResponder->process($routeInfo);

        $responseSender = new ResponseSender();
        $responseSender->send($response);
    }
}