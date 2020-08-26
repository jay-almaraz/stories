<?php

namespace Stories\Api\Http;

use JsonException;

class InputProcessor
{
    /**
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

    public function getRawBody(): string
    {
        return file_get_contents('php://input') ?: '';
    }

    /**
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
     * @return array<string, mixed>
     */
    public function getParams(): array
    {
        return $_POST;
    }
}