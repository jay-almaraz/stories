<?php

namespace Stories\Api\Http;

class FilesProcessor
{
    /**
     * @param string $fileKey
     *
     * @return File
     * @throws FileException
     */
    public function getFile(string $fileKey): File
    {
        $file = $this->findFile($fileKey);
        if ($file === null) {
            throw new FileException('No file found for ' . $fileKey);
        }

        return $file;
    }

    /**
     * @param string $fileKey
     *
     * @return File|null
     * @throws FileException
     */
    public function findFile(string $fileKey): ?File
    {
        $file = $_FILES[$fileKey] ?? null;
        if ($file === null) {
            return null;
        }

        $name = $file['name'] ?? null;
        $type = $file['type'] ?? null;
        $size = $file['size'] ?? null;
        $tmpName = $file['tmp_name'] ?? null;
        $error = $file['error'] ?? null;
        if (!is_string($name) || !is_string($type) || !is_string($tmpName) || !is_int($size) || !is_int($error)) {
            throw new FileException('Invalid file upload structure');
        }

        if ($error !== UPLOAD_ERR_OK) {
            throw new FileException('Error in file uploaded: ' . $error);
        }

        $actualMimeType = mime_content_type($tmpName);
        if ($actualMimeType === false) {
            throw new FileException('Unable to determine MIME type of file');
        }

        return new File(
            $name,
            $tmpName,
            $type,
            $actualMimeType,
            $size,
            $error
        );
    }
}