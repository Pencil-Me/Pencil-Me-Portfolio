<?php

declare(strict_types=1);

use Inc\CorsHeaders;
use PHPUnit\Framework\TestCase;

final class CorsHeadersTest extends TestCase
{
    protected function tearDown(): void
    {
        unset($_SERVER['HTTP_ORIGIN'], $_SERVER['HTTP_REFERER']);
        $ref = new ReflectionClass(CorsHeaders::class);
        $prop = $ref->getProperty('allowedOrigins');
        $prop->setAccessible(true);
        $prop->setValue(null, []);
    }

    public function testOriginFromRefererWhenHeaderMissing(): void
    {
        $_SERVER['HTTP_REFERER'] = 'https://pencil-me.de/projects';
        unset($_SERVER['HTTP_ORIGIN']);

        $method = new ReflectionMethod(CorsHeaders::class, 'resolveRequestOrigin');
        $method->setAccessible(true);

        $this->assertSame('https://pencil-me.de', $method->invoke(null));
    }

    public function testApexOriginAllowedWhenOnlyWwwConfigured(): void
    {
        $ref = new ReflectionClass(CorsHeaders::class);
        $prop = $ref->getProperty('allowedOrigins');
        $prop->setAccessible(true);
        $prop->setValue(null, ['https://www.pencil-me.de']);

        $method = new ReflectionMethod(CorsHeaders::class, 'isOriginAllowed');
        $method->setAccessible(true);

        $this->assertTrue($method->invoke(null, 'https://pencil-me.de'));
    }
}
