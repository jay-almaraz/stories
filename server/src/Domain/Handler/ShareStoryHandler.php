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
        // Connect to DB and instantiate processors
        $dbConnection = DbConnectionFactory::getConnection();
        $inputProcessor = new InputProcessor();
        $fileProcessor = new FilesProcessor();
        $fileUploader = new GoogleFileUploader();

        // Extract params
        $title = $inputProcessor->getParam('title');
        $categoryName = $inputProcessor->getParam('categoryName');
        $cityName = $inputProcessor->getParam('cityName');
        $shiftName = $inputProcessor->getParam('shiftName');
        $recordingDuration = $inputProcessor->getParam('recordingDuration');
        $userName = $inputProcessor->getParam('userName');
        $description = $inputProcessor->getParam('description');
        $sessionId = $inputProcessor->getParam('sessionId');

        // Extract files
        $recording = $fileProcessor->getFile('recording');
        $uploadedFiled = $fileUploader->uploadFile($recording, 'recordings');

        // Prepare DB INSERT statement
        $dbStatement = $dbConnection->prepare(
            'INSERT INTO stories (date, title, name, description, category, city, shift, duration, url, session_id)
            VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?);'
        );

        // Check for valid statement preparation
        if ($dbStatement === false) {
            throw new DbException('Unable to prepare statement: ' . $dbConnection->error);
        }

        // Bind params to DB statement
        $dbBind = $dbStatement->bind_param(
            str_repeat('s', 9),
            $title,
            $userName,
            $description,
            $categoryName,
            $cityName,
            $shiftName,
            $recordingDuration,
            $uploadedFiled->getUrl(),
            $sessionId
        );

        // Check for valid statement bindings
        if ($dbBind === false || $dbStatement->execute() === false) {
            throw new DbException('Unable to insert story: ' . $dbStatement->error);
        }

        // Success
        return new Response(StatusCode::OK);
    }
}