<?php

namespace Inc;

/**
 * Sends outbound mail (SMTP via PHPMailer in production).
 */
interface MailSenderInterface
{
    /**
     * @throws MailSendException
     */
    public function send(string $sender, string $recipient, string $subject, string $messageBody): void;
}
