<?php

require_once __DIR__ . '/bootstrap.php';

use Inc\Config;
use Inc\Router;
use PHPUnit\Framework\TestCase;

class RouterTest extends TestCase
{
    private const BE_KEY = 'test-be-key';

    /** @var array<string, array<string, bool|string>> */
    private array $protectedRoutes;

    protected function setUp(): void
    {
        Config::$apiKeys = [
            'fe_key' => 'test-fe-key',
            'be_key' => self::BE_KEY,
        ];

        $this->protectedRoutes = [
            '/send_email' => ['POST' => true, 'required_key' => 'be_key'],
        ];
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
            $this->invokePrivate('isAuthenticated', ['', 'be_key'])
        );
    }

    public function testIsAuthenticatedRejectsWrongKey(): void
    {
        $this->assertFalse(
            $this->invokePrivate('isAuthenticated', ['wrong-key', 'be_key'])
        );
    }

    public function testIsAuthenticatedAcceptsValidBeKey(): void
    {
        $this->assertTrue(
            $this->invokePrivate('isAuthenticated', [self::BE_KEY, 'be_key'])
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
