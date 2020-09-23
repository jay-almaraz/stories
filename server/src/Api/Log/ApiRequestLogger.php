<?php

namespace Stories\Api\Log;

use Psr\Log\LoggerInterface;
use Stories\Api\Http\InputProcessor;
use Stories\Api\Http\ServerProcessor;

/**
 * Class used for logging an API request sent to the server
 */
class ApiRequestLogger
{
    /** @var string[] Lookup for any request content which should result in the request details being redacted */
    private const REDACTED_CONTENTS = [
        'password',
    ];

    public function logRequest(
        LoggerInterface $logger,
        ServerProcessor $serverProcessor,
        InputProcessor $inputProcessor
    ): void {
        $message = $this->getMessage($serverProcessor);
        $context = $this->getContext($serverProcessor, $inputProcessor);
        $logger->info($message, $context);
    }

    /**
     * Generate the base log message
     *
     * @param ServerProcessor $serverProcessor
     *
     * @return string
     */
    private function getMessage(ServerProcessor $serverProcessor): string
    {
        return $serverProcessor->getHttpMethod() . ' ' . $serverProcessor->getBaseUri();
    }

    /**
     * Generate the extended context of the log message
     *
     * @param ServerProcessor $serverProcessor
     *
     * @param InputProcessor  $inputProcessor
     *
     * @return array<string, mixed>
     */
    private function getContext(ServerProcessor $serverProcessor, InputProcessor $inputProcessor): array
    {
        return [
            'body'    => $this->processBody($inputProcessor->getRawBody()),
            'params'  => $this->processParams($inputProcessor->getParams()),
            'headers' => $serverProcessor->getHeaders(),
            'ip'      => $serverProcessor->getIp(),
        ];
    }

    /**
     * Process the body of the API request
     *
     * @param string $rawBody
     *
     * @return string
     */
    private function processBody(string $rawBody): string
    {
        foreach (self::REDACTED_CONTENTS as $redactedContent) {
            if (str_contains($rawBody, $redactedContent)) {
                return '[REDACTED]';
            }
        }

        return $rawBody;
    }

    /**
     * Process all params of the request
     *
     * @param array<string, mixed> $multipartFormParams
     *
     * @return array<string, mixed>
     */
    private function processParams(array $multipartFormParams): array
    {
        $processedParams = [];
        foreach ($multipartFormParams as $key => $value) {
            $processedParams[$key] = $this->processParam($key, $value);
        }
        return $processedParams;
    }

    /**
     * Process an individual param of the request
     *
     * @param string $key
     * @param string $value
     *
     * @return string
     */
    private function processParam(string $key, string $value): string
    {
        foreach (self::REDACTED_CONTENTS as $redactedContent) {
            if (str_contains($key, $redactedContent) || str_contains($value, $redactedContent)) {
                return '[REDACTED]';
            }
        }

        return $value;
    }
}