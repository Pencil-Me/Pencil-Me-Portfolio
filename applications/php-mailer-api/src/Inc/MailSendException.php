<?php

namespace Inc;

use RuntimeException;

/**
 * Raised when SMTP delivery fails.
 */
final class MailSendException extends RuntimeException
{
    public function __construct(
        string $message,
        public readonly string $errorInfo = '',
        ?\Throwable $previous = null
    ) {
        parent::__construct($message, 0, $previous);
    }
}
