<?php

declare(strict_types=1);

use Inc\Config;
use PHPUnit\Framework\TestCase;

final class ConfigTest extends TestCase
{
    public function testParseAllowedOriginsTrimsAndSkipsEmptyEntries(): void
    {
        $origins = Config::parseAllowedOrigins(
            'https://pencil-me.de, https://www.pencil-me.de,,http://localhost:4200'
        );

        $this->assertSame(
            ['https://pencil-me.de', 'https://www.pencil-me.de', 'http://localhost:4200'],
            $origins
        );
    }
}
