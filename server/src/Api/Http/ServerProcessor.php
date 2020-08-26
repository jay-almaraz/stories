<?php

namespace Stories\Api\Http;

class ServerProcessor
{
    public function getHttpMethod(): string
    {
        return $_SERVER['REQUEST_METHOD'] ?? '';
    }

    public function getBaseUri(): string
    {
        $uri = $_SERVER['REQUEST_URI'];

        $queryPos = strpos($uri, '?');
        if ($queryPos !== false) {
            $uri = substr($uri, 0, $queryPos) ?: '';
        }

        return rawurldecode($uri);
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
    public function getHeader(string $key, $default = null)
    {
        return $_SERVER[$key] ?? $default;
    }

    /**
     * @return array<string, mixed>
     */
    public function getHeaders(): array
    {
        return getallheaders() ?: [];
    }

    public function getIp(): ?string
    {
        $forwardedFor = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? null;
        if ($forwardedFor !== null) {
            return strtok($forwardedFor, ',') ?: $forwardedFor;
        }

        return $_SERVER['REMOTE_ADDR'] ?? null;
    }

    public function getUserAgent(): ?string
    {
        return $_SERVER['HTTP_USER_AGENT'] ?? null;
    }

    public function getContentType(): ?string
    {
        return $_SERVER['CONTENT_TYPE'] ?? null;
    }

    public function isApplicationJson(): bool
    {
        $contentType = $this->getContentType();
        return $contentType !== null && $contentType === 'application/json';
    }

    public function isMultipartForm(): bool
    {
        $contentType = $this->getContentType();
        return $contentType !== null && strpos($contentType, 'multipart/form-data') === 0;
    }
}