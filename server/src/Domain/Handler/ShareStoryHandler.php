<?php

namespace Stories\Domain\Handler;

use Stories\Api\Handler\Handler;
use Stories\Api\Http\FileException;
use Stories\Api\Http\FilesProcessor;
use Stories\Api\Http\InputProcessor;
use Stories\Api\Http\Response;
use Stories\Api\Http\StatusCode;
use Stories\Metal\Db\DbConnectionFactory;
use Stories\Metal\Db\DbException;
use Stories\Metal\Google\Storage\GoogleException;
use Stories\Metal\Google\Storage\GoogleFileUploader;

class ShareStoryHandler extends Handler
{
    /**
     * @return Response
     * @throws FileException
     * @throws GoogleException
     * @throws DbException
     */
    public function handle(): Response
    {
        $dbConnection = DbConnectionFactory::getConnection();
        $inputProcessor = new InputProcessor();
        $fileProcessor = new FilesProcessor();
        $fileUploader = new GoogleFileUploader();

        $title = $inputProcessor->getParam('title');
        $categoryName = $inputProcessor->getParam('categoryName');
        $cityName = $inputProcessor->getParam('cityName');
        $shiftName = $inputProcessor->getParam('shiftName');
        $recordingDuration = $inputProcessor->getParam('recordingDuration');
        $userName = $inputProcessor->getParam('userName');
        $description = $inputProcessor->getParam('description');

        $recording = $fileProcessor->getFile('recording');
        $uploadedFiled = $fileUploader->uploadFile($recording, 'recordings');

        $dbStatement = $dbConnection->prepare(
            'INSERT INTO stories (date, title, name, description, category, city, shift, duration, url)
            VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?, ?);'
        );

        if ($dbStatement === false) {
            throw new DbException('Unable to prepare statement: ' . $dbConnection->error);
        }

        $dbBind = $dbStatement->bind_param(
            str_repeat('s', 8),
            $title,
            $userName,
            $description,
            $categoryName,
            $cityName,
            $shiftName,
            $recordingDuration,
            $uploadedFiled->getUrl()
        );

        if ($dbBind === false || $dbStatement->execute() === false) {
            throw new DbException('Unable to insert story: ' . $dbStatement->error);
        }

        return new Response(StatusCode::OK);
    }
}