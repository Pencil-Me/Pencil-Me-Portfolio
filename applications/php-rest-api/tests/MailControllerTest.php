<?php

require_once __DIR__ . '/bootstrap.php';

use Controller\Api\MailController;
use Inc\AppLogger;
use Inc\Bootstrap;
use Inc\HttpClient;
use Inc\HttpResponse;
use PHPUnit\Framework\TestCase;

class MailControllerTest extends TestCase
{
    protected function setUp(): void
    {
        require_once PROJECT_ROOT_PATH . 'Inc/Bootstrap.php';
        Bootstrap::$logger = new AppLogger(sys_get_temp_dir() . '/pm-mail-test.log', 'ERROR');
        $_SERVER['REQUEST_METHOD'] = 'POST';
        $_POST = [];
    }

    public function testSendEmailRejectsHoneypot(): void
    {
        $_POST = [
            'contactByFax' => '1',
            'name' => 'Jane',
            'email' => 'jane@example.com',
            'message' => 'Hello',
        ];

        $controller = new TestableMailController(new StubHttpClient(new HttpResponse(200, '{}')));
        try {
            $controller->sendEmail();
        } catch (TestResponseSentException) {
        }

        $this->assertSame(['message' => 'Invalid submission'], $controller->lastResponse);
        $this->assertSame(400, $controller->lastStatus);
    }

    public function testSendEmailRejectsMissingParameters(): void
    {
        $_POST = [
            'name' => 'Jane',
        ];

        $controller = new TestableMailController(new StubHttpClient(new HttpResponse(200, '{}')));
        try {
            $controller->sendEmail();
        } catch (TestResponseSentException) {
        }

        $this->assertSame(['message' => 'Missing or invalid required parameters'], $controller->lastResponse);
        $this->assertSame(400, $controller->lastStatus);
    }

    public function testSendEmailForwardsValidSubmission(): void
    {
        $_POST = [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'message' => 'Hello from the contact form',
        ];

        $controller = new TestableMailController(
            new StubHttpClient(new HttpResponse(200, json_encode(['message' => 'ok'])))
        );
        try {
            $controller->sendEmail();
        } catch (TestResponseSentException) {
        }

        $this->assertSame(['message' => 'Data forwarded successfully'], $controller->lastResponse);
        $this->assertSame(200, $controller->lastStatus);
    }
}

final class StubHttpClient extends HttpClient
{
    public function __construct(private readonly HttpResponse $response)
    {
    }

    public function postForm(string $url, array $headers, array $form): HttpResponse
    {
        return $this->response;
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

final class TestResponseSentException extends RuntimeException
{
}
