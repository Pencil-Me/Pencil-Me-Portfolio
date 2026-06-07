<?php

require_once __DIR__ . '/bootstrap.php';

use Inc\RequestPath;
use PHPUnit\Framework\TestCase;

class RequestPathTest extends TestCase
{
    public function testParsesSimplePath(): void
    {
        $this->assertSame('/send_email', RequestPath::parse('/index.php/send_email'));
    }

    public function testParsesHealthcheckPath(): void
    {
        $this->assertSame('/healthcheck', RequestPath::parse('/index.php/healthcheck'));
    }

    public function testRejectsInvalidCharacters(): void
    {
        $this->assertNull(RequestPath::parse('/index.php/send_email<script>'));
        $this->assertNull(RequestPath::parse('/index.php/send email'));
    }
}
