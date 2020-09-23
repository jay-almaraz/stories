<?php

namespace Stories\Api\Http;

use JsonException;

/**
 * Utility class for processing the input stream of an API POST request
 */
class InputProcessor
{
    /**
     * Parse the raw JSON body of an API request into an associative array, throwing an exception on failure
     *
     * @return array<mixed>
     * @throws HttpException
     */
    public function getDecodedJsonBody(): array
    {
        try {
            $requestRawBody = $this->getRawBody();
            return json_decode($requestRawBody, true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException $e) {
            throw new HttpException('Unable to decode input body');
        }
    }

    /**
     * Get the raw JSON body of an API request
     *
     * @return string
     */
    public function getRawBody(): string
    {
        return file_get_contents('php://input') ?: '';
    }

    /**
     * Get an individual param from an API request
     *
     * @param string $key
     * @param mixed  $default
     *
     * @return mixed
     *
     * @phpstan-template T
     * @phpstan-param T $default
     * @phpstan-return string|T
     */
    public function getParam(string $key, $default = null)
    {
        return $_POST[$key] ?? $default;
    }

    /**
     * Get all params from an API request
     *
     * @return array<string, mixed>
     */
    public function getParams(): array
    {
        return $_POST;
    }
}