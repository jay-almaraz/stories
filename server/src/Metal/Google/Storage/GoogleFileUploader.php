<?php

namespace Stories\Metal\Google\Storage;

use Google\Cloud\Storage\StorageClient;
use Stories\Api\Http\File;

/**
 * Stateless class for uploading files to Google Cloud
 */
class GoogleFileUploader
{
    /** @var string Root URL for all uploaded cloud objects */
    public const  ROOT_URL      = 'https://storage.googleapis.com/';
    /** @var string Bucket name to be used for all cloud objects */
    private const UPLOAD_BUCKET = 'stories-upload';

    /**
     * File upload method, returning a storage object DTO
     *
     * @param File   $file
     * @param string $dir
     *
     * @return GoogleStorageObject
     * @throws GoogleException
     */
    public function uploadFile(File $file, string $dir): GoogleStorageObject
    {
        $storage = new StorageClient();

        $bucket = $storage->bucket(self::UPLOAD_BUCKET);

        // Randomise object name to avoid conflicts
        $ext = pathinfo($file->getName(), PATHINFO_EXTENSION);
        $name = date('ymdHis') . '_' . mt_rand() . '.' . $ext;

        $fd = fopen($file->getTmpName(), 'rb');
        if ($fd === false) {
            throw new GoogleException('unable to open uploaded file: ' . $file->getTmpName());
        }

        $objectName = $dir . '/' . $name;

        $bucket->upload(
            $fd,
            ['name' => $objectName]
        );

        $url = self::ROOT_URL . self::UPLOAD_BUCKET . '/' . $objectName;
        return new GoogleStorageObject(self::UPLOAD_BUCKET, $objectName, $url);
    }
}