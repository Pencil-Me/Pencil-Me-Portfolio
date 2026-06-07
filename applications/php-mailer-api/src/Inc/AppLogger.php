<?php

namespace Inc;

/**
 * Simple file logger for the mailer service.
 */
class AppLogger
{
    private const LEVELS = [
        'DEBUG' => 0,
        'INFO' => 1,
        'WARNING' => 2,
        'ERROR' => 3,
    ];

    public static function error(string $message, array $context = []): void
    {
        if (!self::shouldLog('ERROR')) {
            return;
        }

        self::write('ERROR', $message, $context);
    }

    public static function debug(string $message, array $context = []): void
    {
        if (!self::shouldLog('DEBUG')) {
            return;
        }

        self::write('DEBUG', $message, $context);
    }

    private static function shouldLog(string $level): bool
    {
        $configured = Config::getLogLevel();
        $configuredLevel = self::LEVELS[$configured] ?? self::LEVELS['DEBUG'];
        $messageLevel = self::LEVELS[$level] ?? self::LEVELS['ERROR'];

        return $messageLevel >= $configuredLevel;
    }

    private static function write(string $level, string $message, array $context): void
    {
        $logDir = PROJECT_ROOT_PATH . 'logs';
        if (!is_dir($logDir)) {
            mkdir($logDir, 0755, true);
        }

        $safeContext = self::redactSecrets($context);
        $line = date('c') . ' ' . $level . ' ' . $message;
        if ($safeContext !== []) {
            $line .= ' ' . json_encode($safeContext, JSON_UNESCAPED_UNICODE);
        }

        error_log($line . PHP_EOL, 3, $logDir . '/mail.log');
    }

    private static function redactSecrets(array $context): array
    {
        foreach ($context as $key => $value) {
            if (is_string($key) && preg_match('/password|secret|api[_-]?key|token/i', $key) === 1) {
                $context[$key] = '[redacted]';
            }
        }

        return $context;
    }
}
