<?php

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/TestResponseSentException.php';

use Controller\Api\MailController;
use Inc\Config;
use Inc\MailSendException;
use Inc\MailSenderInterface;
use PHPUnit\Framework\TestCase;

class MailControllerTest extends TestCase
{
    protected function setUp(): void
    {
        $_SERVER['REQUEST_METHOD'] = 'POST';
        $_POST = [];

        Config::$mailHost = 'smtp.test';
        Config::$mailPort = '587';
        Config::$mailUsername = 'smtp-user@test.com';
        Config::$mailPassword = 'secret';
        Config::$mailSender = 'noreply@test.com';
        Config::$mailFromName = 'Portfolio';
        Config::$mailSmtpSecure = 'tls';
    }

    public function testSendEmailRejectsMissingParameters(): void
    {
        $_POST = ['sender' => 'a@test.com'];

        $controller = new TestableMailController(new FakeMailSender());
        try {
            $controller->sendEmail();
        } catch (TestResponseSentException) {
        }

        $this->assertSame(['message' => 'Missing required parameters'], $controller->lastResponse);
        $this->assertSame(400, $controller->lastStatus);
    }

    public function testSendEmailRejectsInvalidSenderEmail(): void
    {
        $_POST = $this->validPayload(['sender' => 'not-an-email']);

        $controller = new TestableMailController(new FakeMailSender());
        try {
            $controller->sendEmail();
        } catch (TestResponseSentException) {
        }

        $this->assertSame(['message' => 'Invalid email address'], $controller->lastResponse);
        $this->assertSame(400, $controller->lastStatus);
    }

    public function testSendEmailRejectsInvalidRecipientEmail(): void
    {
        $_POST = $this->validPayload(['recipient' => 'bad']);

        $controller = new TestableMailController(new FakeMailSender());
        try {
            $controller->sendEmail();
        } catch (TestResponseSentException) {
        }

        $this->assertSame(['message' => 'Invalid email address'], $controller->lastResponse);
        $this->assertSame(400, $controller->lastStatus);
    }

    public function testSendEmailRejectsSubjectTooLong(): void
    {
        $_POST = $this->validPayload(['subject' => str_repeat('x', 201)]);

        $controller = new TestableMailController(new FakeMailSender());
        try {
            $controller->sendEmail();
        } catch (TestResponseSentException) {
        }

        $this->assertSame(['message' => 'Subject too long'], $controller->lastResponse);
        $this->assertSame(400, $controller->lastStatus);
    }

    public function testSendEmailRejectsMessageTooLong(): void
    {
        $_POST = $this->validPayload(['message' => str_repeat('x', 10001)]);

        $controller = new TestableMailController(new FakeMailSender());
        try {
            $controller->sendEmail();
        } catch (TestResponseSentException) {
        }

        $this->assertSame(['message' => 'Message too long'], $controller->lastResponse);
        $this->assertSame(400, $controller->lastStatus);
    }

    public function testSendEmailReturns500WhenTransportFails(): void
    {
        $_POST = $this->validPayload();
        $sender = new FakeMailSender();
        $sender->shouldThrow = true;

        $controller = new TestableMailController($sender);
        try {
            $controller->sendEmail();
        } catch (TestResponseSentException) {
        }

        $this->assertSame(['message' => 'E-Mail konnte nicht gesendet werden.'], $controller->lastResponse);
        $this->assertSame(500, $controller->lastStatus);
    }

    public function testSendEmailSucceedsWithValidPayload(): void
    {
        $_POST = $this->validPayload();
        $sender = new FakeMailSender();

        $controller = new TestableMailController($sender);
        try {
            $controller->sendEmail();
        } catch (TestResponseSentException) {
        }

        $this->assertTrue($sender->sent);
        $this->assertSame(['message' => 'Email sent'], $controller->lastResponse);
        $this->assertSame(200, $controller->lastStatus);
    }

    /**
     * @param array<string, string> $overrides
     * @return array<string, string>
     */
    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'sender' => 'visitor@example.com',
            'recipient' => 'owner@example.com',
            'subject' => 'Contact form',
            'message' => 'Hello from the portfolio site.',
        ], $overrides);
    }
}

final class FakeMailSender implements MailSenderInterface
{
    public bool $sent = false;

    public bool $shouldThrow = false;

    public function send(string $sender, string $recipient, string $subject, string $messageBody): void
    {
        if ($this->shouldThrow) {
            throw new MailSendException('SMTP failed', 'mock error');
        }

        $this->sent = true;
    }
}

final class TestableMailController extends MailController
{
    public ?array $lastResponse = null;

    public ?int $lastStatus = null;

    protected function jsonResponse(mixed $payload, int $status = 200): void
    {
        $this->lastResponse = is_array($payload) ? $payload : ['payload' => $payload];
        $this->lastStatus = $status;
        throw new TestResponseSentException();
    }
}
