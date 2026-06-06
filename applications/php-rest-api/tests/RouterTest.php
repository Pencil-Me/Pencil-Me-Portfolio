<?php

require_once __DIR__ . '/bootstrap.php';

use Inc\Config;
use Inc\Router;
use PHPUnit\Framework\TestCase;

class RouterTest extends TestCase
{
    private const FE_KEY = 'test-fe-key';
    private const BE_KEY = 'test-be-key';
    private const UUID = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

    private array $protectedRoutes;

    protected function setUp(): void
    {
        Config::$apiKeys = [
            'fe_key' => self::FE_KEY,
            'be_key' => self::BE_KEY,
        ];

        $this->protectedRoutes = [
            '/all_projects' => ['GET' => true, 'required_key' => 'fe_key'],
            '/get_project/(\w+)' => ['GET' => true, 'required_key' => 'fe_key'],
            '/send_email' => ['POST' => true, 'required_key' => 'fe_key'],
        ];

        require_once PROJECT_ROOT_PATH . 'Inc/Router.php';
    }

    public function testParameterizedRoutePatternIsProtected(): void
    {
        $this->assertTrue(
            $this->invokePrivate('isRouteProtected', ['/get_project/(\w+)', 'GET', $this->protectedRoutes])
        );
    }

    public function testParameterizedRequestPathIsNotProtectedWhenCheckedDirectly(): void
    {
        $requestPath = '/get_project/' . self::UUID;

        $this->assertFalse(
            $this->invokePrivate('isRouteProtected', [$requestPath, 'GET', $this->protectedRoutes])
        );
    }

    public function testMatchRouteReturnsRoutePattern(): void
    {
        $routes = [
            '/get_project/(\w+)' => [
                'GET' => [
                    'controller' => 'Controller\Api\ProjectsController',
                    'method' => 'getProjectFe',
                ],
            ],
        ];

        $match = $this->invokePrivate('matchRoute', ['/get_project/' . self::UUID, $routes]);

        $this->assertSame('/get_project/(\w+)', $match['pattern']);
        $this->assertSame(self::UUID, $match['params']['id']);
        $this->assertArrayHasKey('GET', $match['handlers']);
    }

    public function testIsAuthenticatedRejectsMissingKey(): void
    {
        $this->assertFalse(
            $this->invokePrivate('isAuthenticated', ['', 'fe_key'])
        );
    }

    public function testIsAuthenticatedRejectsWrongKey(): void
    {
        $this->assertFalse(
            $this->invokePrivate('isAuthenticated', ['wrong-key', 'fe_key'])
        );
    }

    public function testIsAuthenticatedAcceptsValidKey(): void
    {
        $this->assertTrue(
            $this->invokePrivate('isAuthenticated', [self::FE_KEY, 'fe_key'])
        );
    }

    public function testStaticRouteIsProtected(): void
    {
        $this->assertTrue(
            $this->invokePrivate('isRouteProtected', ['/all_projects', 'GET', $this->protectedRoutes])
        );
    }

    public function testInvalidUuidReturnsNullFromMatchRoute(): void
    {
        $routes = [
            '/get_project/(\w+)' => [
                'GET' => [
                    'controller' => 'Controller\Api\ProjectsController',
                    'method' => 'getProjectFe',
                ],
            ],
        ];

        $match = $this->invokePrivate('matchRoute', ['/get_project/not-a-uuid', $routes]);
        $this->assertNull($match);
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
