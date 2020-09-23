<?php

namespace Stories\Api\Http;

use JsonException;

/**
 * Class used for sending a response object over the network
 */
class ResponseSender
{
    /**
     * @param Response $response
     *
     * @throws HttpException
     */
    public function send(Response $response): void
    {
        $this->setResponseCode($response);
        $this->sendResponseBody($response);
    }

    /**
     * Set the response code of the network request
     *
     * @param Response $response
     */
    private function setResponseCode(Response $response): void
    {
        http_response_code($response->getStatusCode());
    }

    /**
     * Send the response body over the network
     *
     * @param Response $response
     *
     * @throws HttpException
     */
    private function sendResponseBody(Response $response): void
    {
        $encodedBody = $this->getEncodedBody($response);
        echo $encodedBody . PHP_EOL;
    }

    /**
     * Encode the response body into JSON format, throw exception on failure
     *
     * @param Response $response
     *
     * @return string
     * @throws HttpException
     */
    private function getEncodedBody(Response $response): string
    {
        try {
            $rawBody = $this->getRawBody($response);
            return json_encode($rawBody, JSON_THROW_ON_ERROR);
        } catch (JsonException $e) {
            throw new HttpException('Unable to encode response body');
        }
    }

    /**
     * Get the raw, unencoded body of the response object
     *
     * @param Response $response
     *
     * @return array<string, mixed>
     */
    private function getRawBody(Response $response): array
    {
        $responseBody = [];

        $data = $response->getData();
        if ($data !== null) {
            $responseBody['data'] = $data;
        }

        $errors = $response->getErrors();
        if ($errors !== null) {
            $responseBody['errors'] = $errors;
        }

        return $responseBody;
    }
}