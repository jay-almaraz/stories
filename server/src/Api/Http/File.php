<?php

namespace Stories\Api\Http;

use JsonSerializable;

/**
 * DTO representing a local file on the server, most likely as the result of a POST file upload
 */
class File implements JsonSerializable
{
    private string $name;
    private string $tmpName;
    private string $requestMimeType;
    private string $serverMimeType;
    private int $size;
    private int $error;

    public function __construct(
        string $name,
        string $tmpName,
        string $requestMimeType,
        string $serverMimeType,
        int $size,
        int $error
    ) {
        $this->name = $name;
        $this->tmpName = $tmpName;
        $this->requestMimeType = $requestMimeType;
        $this->serverMimeType = $serverMimeType;
        $this->size = $size;
        $this->error = $error;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getTmpName(): string
    {
        return $this->tmpName;
    }

    public function getRequestMimeType(): string
    {
        return $this->requestMimeType;
    }

    public function getServerMimeType(): string
    {
        return $this->serverMimeType;
    }

    public function getSize(): int
    {
        return $this->size;
    }

    public function getError(): int
    {
        return $this->error;
    }

    /**
     * @return array<string, mixed>
     */
    public function jsonSerialize(): array
    {
        return [
            'name'            => $this->name,
            'tmpName'         => $this->tmpName,
            'requestMimeType' => $this->requestMimeType,
            'serverMimeType'  => $this->serverMimeType,
            'size'            => $this->size,
            'error'           => $this->error,
        ];
    }
}