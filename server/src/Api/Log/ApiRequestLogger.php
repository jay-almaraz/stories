<?php

namespace Stories\Api\Log;

use Psr\Log\LoggerInterface;
use Stories\Api\Http\InputProcessor;
use Stories\Api\Http\ServerProcessor;

class ApiRequestLogger
{
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

    private function getMessage(ServerProcessor $serverProcessor): string
    {
        return $serverProcessor->getHttpMethod() . ' ' . $serverProcessor->getBaseUri();
    }

    /**
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