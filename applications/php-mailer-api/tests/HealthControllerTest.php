<?php

require_once __DIR__ . '/bootstrap.php';

use Controller\Api\HealthController;
use PHPUnit\Framework\TestCase;

class HealthControllerTest extends TestCase
{
    public function testGetHealthcheckReturnsOk(): void
    {
        $controller = new HealthController();

        $this->expectOutputString(json_encode(['status' => 'OK']));
        $controller->getHealthcheck();
    }
}
