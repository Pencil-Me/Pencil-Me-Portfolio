<?php

require_once __DIR__ . '/bootstrap.php';

use Inc\RequestPath;
use PHPUnit\Framework\TestCase;

class RequestPathTest extends TestCase
{
    public function testParsesSimplePath(): void
    {
        $this->assertSame('/all_projects', RequestPath::parse('/index.php/all_projects'));
    }

    public function testParsesPathWithUuidSegment(): void
    {
        $uuid = '11111111-2222-3333-4444-555555555555';
        $this->assertSame('/get_project/' . $uuid, RequestPath::parse('/index.php/get_project/' . $uuid));
    }

    public function testRejectsInvalidCharacters(): void
    {
        $this->assertNull(RequestPath::parse('/index.php/send_email<script>'));
        $this->assertNull(RequestPath::parse('/index.php/all projects'));
    }
}
