<?php

namespace Controller\Api;

use Inc\AppLogger;
use Inc\MailSendException;
use Inc\MailSenderInterface;
use Inc\PhpmailerMailSender;

/**
 * Sends emails via injectable SMTP transport.
 * Honeypot and rate limiting live in php-rest-api (gateway).
 */
class MailController extends BaseController
{
    private const MAX_SUBJECT_LENGTH = 200;

    private const MAX_MESSAGE_LENGTH = 10000;

    private MailSenderInterface $mailSender;

    public function __construct(?MailSenderInterface $mailSender = null)
    {
        $this->mailSender = $mailSender ?? new PhpmailerMailSender();
    }

    public function sendEmail(): void
    {
        try {
            if (!$this->isRequestMethodAllowed('POST')) {
                $this->sendMethodNotAllowedResponse();
            }

            $sender = $this->getPostField('sender');
            $recipient = $this->getPostField('recipient');
            $subject = $this->getPostField('subject');
            $message = $this->getPostField('message');

            if (!$this->validateParameters($sender, $recipient, $subject, $message)) {
                return;
            }

            $this->mailSender->send(
                trim((string) $sender),
                trim((string) $recipient),
                trim((string) $subject),
                trim((string) $message)
            );

            $this->sendSuccessResponse(['message' => 'Email sent']);
        } catch (MailSendException $exception) {
            AppLogger::error('PHPMailer send failed', [
                'error_info' => $exception->errorInfo,
                'exception' => $exception->getMessage(),
            ]);
            $this->sendGenericErrorResponse(
                'E-Mail konnte nicht gesendet werden.',
                500
            );
        }
    }

    protected function getPostField(string $key): mixed
    {
        return $_POST[$key] ?? null;
    }

    private function validateParameters(
        mixed $sender,
        mixed $recipient,
        mixed $subject,
        mixed $message
    ): bool {
        if (!is_string($sender) || !is_string($recipient) || !is_string($subject) || !is_string($message)) {
            $this->sendOutput(['message' => 'Missing required parameters'], 400);
            return false;
        }

        $sender = trim($sender);
        $recipient = trim($recipient);
        $subject = trim($subject);
        $message = trim($message);

        if ($sender === '' || $recipient === '' || $subject === '' || $message === '') {
            $this->sendOutput(['message' => 'Missing required parameters'], 400);
            return false;
        }

        if (!filter_var($sender, FILTER_VALIDATE_EMAIL) || !filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
            $this->sendOutput(['message' => 'Invalid email address'], 400);
            return false;
        }

        if (strlen($subject) > self::MAX_SUBJECT_LENGTH) {
            $this->sendOutput(['message' => 'Subject too long'], 400);
            return false;
        }

        if (strlen($message) > self::MAX_MESSAGE_LENGTH) {
            $this->sendOutput(['message' => 'Message too long'], 400);
            return false;
        }

        return true;
    }
}
