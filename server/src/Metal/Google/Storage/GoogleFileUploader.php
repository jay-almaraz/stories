<?php

namespace Stories\Metal\Google\Storage;

use Google\Cloud\Storage\StorageClient;
use Stories\Api\Http\File;

class GoogleFileUploader
{
    public const  ROOT_URL      = 'https://storage.googleapis.com/';
    private const UPLOAD_BUCKET = 'stories-upload';

    /**
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