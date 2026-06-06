<?php

require_once __DIR__ . '/bootstrap.php';

use Controller\Api\BaseController;
use Inc\Bootstrap;
use Monolog\Handler\NullHandler;
use Monolog\Logger;
use PHPUnit\Framework\TestCase;

class BaseControllerTest extends TestCase
{
    private TestableBaseController $controller;

    protected function setUp(): void
    {
        require_once PROJECT_ROOT_PATH . 'Inc/Bootstrap.php';
        Bootstrap::$logger = new Logger('test');
        Bootstrap::$logger->pushHandler(new NullHandler());

        $this->controller = new TestableBaseController();
    }

    public function testSendSuccessResponse(): void
    {
        $this->controller->callSendSuccess(['message' => 'Success']);
        $this->assertSame(['message' => 'Success'], $this->controller->lastResponse);
        $this->assertSame(200, $this->controller->lastStatus);
    }

    public function testSendErrorResponse(): void
    {
        $exception = new Exception('Test Exception');
        $this->controller->callSendError($exception);
        $this->assertSame(
            ['message' => 'An unexpected error occurred. Please try again later.'],
            $this->controller->lastResponse
        );
        $this->assertSame(500, $this->controller->lastStatus);
    }

    public function testGetQueryLimitDefaultsToOneHundred(): void
    {
        $_SERVER['QUERY_STRING'] = '';
        $this->assertSame(100, $this->controller->callGetQueryLimit());
    }

    public function testGetQueryLimitCapsAtMaximum(): void
    {
        $_SERVER['QUERY_STRING'] = 'limit=999999';
        $this->assertSame(100, $this->controller->callGetQueryLimit());
    }

    public function testGetQueryLimitEnforcesMinimumOfOne(): void
    {
        $_SERVER['QUERY_STRING'] = 'limit=0';
        $this->assertSame(1, $this->controller->callGetQueryLimit());
    }
}

final class TestableBaseController extends BaseController
{
    public ?array $lastResponse = null;
    public ?int $lastStatus = null;

    public function callSendSuccess(array $data): void
    {
        $this->sendSuccessResponse($data);
    }

    public function callSendError(\Throwable $exception): void
    {
        $this->sendErrorResponse($exception);
    }

    public function callGetQueryLimit(): int
    {
        return $this->getQueryLimit();
    }

    protected function jsonResponse(mixed $payload, int $status = 200): void
    {
        $this->lastResponse = is_array($payload) ? $payload : ['payload' => $payload];
        $this->lastStatus = $status;
    }
}
