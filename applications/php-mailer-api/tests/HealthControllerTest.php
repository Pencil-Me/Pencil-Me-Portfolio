<?php

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/TestResponseSentException.php';

use Controller\Api\HealthController;
use PHPUnit\Framework\TestCase;

class HealthControllerTest extends TestCase
{
    public function testGetHealthcheckReturnsOk(): void
    {
        $controller = new TestableHealthController();

        try {
            $controller->getHealthcheck();
        } catch (TestResponseSentException) {
        }

        $this->assertSame(['status' => 'OK'], $controller->lastResponse);
        $this->assertSame(200, $controller->lastStatus);
    }
}

final class TestableHealthController extends HealthController
{
    public ?array $lastResponse = null;

    public ?int $lastStatus = null;

    protected function jsonResponse(mixed $payload, int $status = 200): void
    {
        $this->lastResponse = is_array($payload) ? $payload : ['payload' => $payload];
        $this->lastStatus = $status;
        throw new TestResponseSentException();
    }
}
