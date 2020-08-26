<?php

namespace Stories\Metal\Google\Storage;

class GoogleStorageObject
{
    private string $bucketName;
    private string $objectName;
    private string $url;

    public function __construct(string $bucketName, string $objectName, string $url)
    {
        $this->bucketName = $bucketName;
        $this->objectName = $objectName;
        $this->url = $url;
    }

    public function getBucketName(): string
    {
        return $this->bucketName;
    }

    public function getObjectName(): string
    {
        return $this->objectName;
    }

    public function getUrl(): string
    {
        return $this->url;
    }
}