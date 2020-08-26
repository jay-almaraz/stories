<?php

namespace Stories\Api\Http;

class Response
{
    private int $statusCode;
    /** @var array<mixed>|null */
    private ?array $data;
    /** @var array<mixed>|null */
    private ?array $errors;

    /**
     * @param int               $statusCode
     * @param array<mixed>|null $data
     * @param array<mixed>|null $errors
     */
    public function __construct(int $statusCode = StatusCode::OK, ?array $data = [], ?array $errors = null)
    {
        $this->statusCode = $statusCode;
        $this->data = $data;
        $this->errors = $errors;
    }

    public function getStatusCode(): int
    {
        return $this->statusCode;
    }

    /**
     * @return array<mixed>
     */
    public function getData(): ?array
    {
        return $this->data;
    }

    /**
     * @return array<mixed>|null
     */
    public function getErrors(): ?array
    {
        return $this->errors;
    }
}