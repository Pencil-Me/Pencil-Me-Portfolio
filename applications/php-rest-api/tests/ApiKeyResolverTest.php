<?php

declare(strict_types=1);

use Inc\ApiKeyResolver;
use PHPUnit\Framework\TestCase;

final class ApiKeyResolverTest extends TestCase
{
    protected function tearDown(): void
    {
        unset($_SERVER['HTTP_API_KEY'], $_GET['api_key'], $_GET['api-key'], $_POST['api_key']);
    }

    public function testResolvesFromHeader(): void
    {
        $_SERVER['HTTP_API_KEY'] = 'from-header';
        $this->assertSame('from-header', ApiKeyResolver::resolve());
    }

    public function testResolvesFromQueryWhenHeaderMissing(): void
    {
        $_GET['api_key'] = 'from-query';
        $this->assertSame('from-query', ApiKeyResolver::resolve());
    }

    public function testResolvesFromPostBody(): void
    {
        $_POST['api_key'] = 'from-body';
        $this->assertSame('from-body', ApiKeyResolver::resolve());
    }

    public function testHeaderTakesPrecedenceOverQuery(): void
    {
        $_SERVER['HTTP_API_KEY'] = 'header-wins';
        $_GET['api_key'] = 'query-loses';
        $this->assertSame('header-wins', ApiKeyResolver::resolve());
    }
}
