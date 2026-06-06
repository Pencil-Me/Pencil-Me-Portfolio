<?php

require_once __DIR__ . '/bootstrap.php';

use Controller\Api\BaseController;
use Inc\Bootstrap;
use Monolog\Handler\NullHandler;
use Monolog\Logger;
use PHPUnit\Framework\TestCase;

class BaseControllerTest extends TestCase
{
    private BaseController $controller;

    protected function setUp(): void
    {
        require_once PROJECT_ROOT_PATH . 'Inc/Bootstrap.php';
        Bootstrap::$logger = new Logger('test');
        Bootstrap::$logger->pushHandler(new NullHandler());

        $this->controller = new class extends BaseController {
            public function callSendSuccess(array $data): void
            {
                $this->sendSuccessResponse($data);
            }

            public function callSendError(\Throwable $exception): void
            {
                $this->sendErrorResponse($exception);
            }
        };
    }

    public function testSendSuccessResponse(): void
    {
        $this->expectOutputString(json_encode(['message' => 'Success']));
        $this->controller->callSendSuccess(['message' => 'Success']);
    }

    public function testSendErrorResponse(): void
    {
        $exception = new Exception('Test Exception');
        $this->expectOutputString(json_encode(['message' => 'An unexpected error occurred. Please try again later.']));
        $this->controller->callSendError($exception);
    }
}
