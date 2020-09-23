<?php

namespace Stories\Api\Http;

/**
 * Utility class for processing general properties of an API request
 */
class ServerProcessor
{
    /**
     * Get the HTTP request method of an API request
     *
     * @return string
     */
    public function getHttpMethod(): string
    {
        return $_SERVER['REQUEST_METHOD'] ?? '';
    }

    /**
     * Get the base URI of an API request
     *
     * @return string
     */
    public function getBaseUri(): string
    {
        $uri = $_SERVER['REQUEST_URI'];

        // Remove all query parameters
        $queryPos = strpos($uri, '?');
        if ($queryPos !== false) {
            $uri = substr($uri, 0, $queryPos) ?: '';
        }

        return rawurldecode($uri);
    }

    /**
     * Get an individual header from an API request
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
    public function getHeader(string $key, $default = null)
    {
        return $_SERVER[$key] ?? $default;
    }

    /**
     * Get all headers from an API request
     *
     * @return array<string, mixed>
     */
    public function getHeaders(): array
    {
        return getallheaders() ?: [];
    }

    /**
     * Get the IP address of an API request
     *
     * @return string|null
     */
    public function getIp(): ?string
    {
        // Check for a forwarded for header first, accounting for a reverse proxy deployment configuration
        $forwardedFor = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? null;
        if ($forwardedFor !== null) {
            return strtok($forwardedFor, ',') ?: $forwardedFor;
        }

        return $_SERVER['REMOTE_ADDR'] ?? null;
    }

    /**
     * Get the user agent of an API request
     *
     * @return string|null
     */
    public function getUserAgent(): ?string
    {
        return $_SERVER['HTTP_USER_AGENT'] ?? null;
    }

    /**
     * Get the content type of an API request
     *
     * @return string|null
     */
    public function getContentType(): ?string
    {
        return $_SERVER['CONTENT_TYPE'] ?? null;
    }

    /**
     * Determine whether or not the API request has JSON content type
     *
     * @return bool
     */
    public function isApplicationJson(): bool
    {
        $contentType = $this->getContentType();
        return $contentType !== null && $contentType === 'application/json';
    }

    /**
     * Determine whether or not the API request has multipart form content type
     *
     * @return bool
     */
    public function isMultipartForm(): bool
    {
        $contentType = $this->getContentType();
        return $contentType !== null && strpos($contentType, 'multipart/form-data') === 0;
    }
}