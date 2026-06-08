<?php

declare(strict_types=1);

use Inc\EnvLoader;
use PHPUnit\Framework\TestCase;

final class EnvLoaderTest extends TestCase
{
    private string $tmpDir;

    protected function setUp(): void
    {
        $this->tmpDir = sys_get_temp_dir() . '/pm-envloader-' . uniqid('', true);
        mkdir($this->tmpDir);
    }

    protected function tearDown(): void
    {
        foreach (glob($this->tmpDir . '/*') ?: [] as $file) {
            unlink($file);
        }
        rmdir($this->tmpDir);
    }

    public function testResolveEnvFilePathPrefersProdWhenBothExist(): void
    {
        file_put_contents($this->tmpDir . '/.env.dev', "ALLOWED_ORIGINS=http://localhost\n");
        file_put_contents($this->tmpDir . '/.env.prod', "ALLOWED_ORIGINS=https://pencil-me.de\n");

        $resolved = EnvLoader::resolveEnvFilePath($this->tmpDir);

        $this->assertSame($this->tmpDir . '/.env.prod', $resolved);
        $this->assertSame(['https://pencil-me.de'], EnvLoader::parseAllowedOriginsFromFile($resolved));
    }

    public function testParseAllowedOriginsValueTrimsEntries(): void
    {
        $this->assertSame(
            ['https://pencil-me.de', 'https://www.pencil-me.de'],
            EnvLoader::parseAllowedOriginsValue('https://pencil-me.de, https://www.pencil-me.de,,')
        );
    }
}
