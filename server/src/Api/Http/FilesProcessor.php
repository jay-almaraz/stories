<?php

namespace Stories\Api\Http;

/**
 * Utility class for processing the files present in an API POST request
 */
class FilesProcessor
{
    /**
     * Get a file that is assumed to be present in a request, fail by exception if not present
     *
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
     * Attempt to get a file that may be present in a request, return null if not present
     *
     * @param string $fileKey
     *
     * @return File|null
     * @throws FileException
     */
    public function findFile(string $fileKey): ?File
    {
        // Check existence of file
        $file = $_FILES[$fileKey] ?? null;
        if ($file === null) {
            return null;
        }

        // Check correct format of found file
        $name = $file['name'] ?? null;
        $type = $file['type'] ?? null;
        $size = $file['size'] ?? null;
        $tmpName = $file['tmp_name'] ?? null;
        $error = $file['error'] ?? null;
        if (!is_string($name) || !is_string($type) || !is_string($tmpName) || !is_int($size) || !is_int($error)) {
            throw new FileException('Invalid file upload structure');
        }

        // Check for any upload errors identified by PHP
        if ($error !== UPLOAD_ERR_OK) {
            throw new FileException('Error in file uploaded: ' . $error);
        }

        // Validate MIME type against provided
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