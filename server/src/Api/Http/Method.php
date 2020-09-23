<?php

namespace Stories\Api\Http;

/**
 * Class of namespaced constants used as a reference for HTTP request methods
 * @see https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol#Request_methods
 */
class Method
{
    public const GET     = 'GET';
    public const HEAD    = 'HEAD';
    public const POST    = 'POST';
    public const PUT     = 'PUT';
    public const DELETE  = 'DELETE';
    public const CONNECT = 'CONNECT';
    public const OPTIONS = 'OPTIONS';
    public const TRACE   = 'TRACE';
    public const PATCH   = 'PATCH';
}