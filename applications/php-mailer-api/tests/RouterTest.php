<?php

require_once __DIR__ . '/bootstrap.php';

use Inc\Config;
use Inc\Router;
use PHPUnit\Framework\TestCase;

class RouterTest extends TestCase
{
    private const FE_KEY = 'test-fe-key';

    private array $protectedRoutes;

    protected function setUp(): void
    {
        Config::$apiKeys = [
            'fe_key' => self::FE_KEY,
            'be_key' => 'test-be-key',
        ];

        $this->protectedRoutes = [
            '/send_email' => ['POST' => true, 'required_key' => 'fe_key'],
        ];

        require_once PROJECT_ROOT_PATH . 'Inc/Router.php';
    }

    public function testSendEmailRouteIsProtected(): void
    {
        $this->assertTrue(
            $this->invokePrivate('isRouteProtected', ['/send_email', 'POST', $this->protectedRoutes])
        );
    }

    public function testIsAuthenticatedRejectsMissingKey(): void
    {
        $this->assertFalse(
            $this->invokePrivate('isAuthenticated', ['', 'fe_key'])
        );
    }

    public function testIsAuthenticatedAcceptsValidKey(): void
    {
        $this->assertTrue(
            $this->invokePrivate('isAuthenticated', [self::FE_KEY, 'fe_key'])
        );
    }

    /**
     * @param array<int, mixed> $arguments
     */
    private function invokePrivate(string $method, array $arguments): mixed
    {
        $reflection = new ReflectionClass(Router::class);
        $routerMethod = $reflection->getMethod($method);
        $routerMethod->setAccessible(true);

        return $routerMethod->invokeArgs(null, $arguments);
    }
}
