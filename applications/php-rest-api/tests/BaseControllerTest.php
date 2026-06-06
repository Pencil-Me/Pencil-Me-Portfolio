<?php

use PHPUnit\Framework\TestCase;
use Controller\Api\BaseController;

require_once __DIR__ . '/../vendor/autoload.php';

class BaseControllerTest extends TestCase
{
    private $baseController;

    protected function setUp(): void
    {
        $this->baseController = $this->getMockForAbstractClass(BaseController::class);
    }

    public function testSendSuccessResponse()
    {
        $this->expectOutputString(json_encode(['message' => 'Success']));
        $this->baseController->sendSuccessResponse(['message' => 'Success']);
    }

    public function testSendErrorResponse()
    {
        $exception = new Exception('Test Exception');
        $this->expectOutputString(json_encode(['error' => 'An unexpected error occurred. Please try again later.']));
        $this->baseController->sendErrorResponse($exception);
    }

    // Weitere Tests für andere Methoden...
} 