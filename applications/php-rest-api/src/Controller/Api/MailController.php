<?php

namespace Controller\Api;

use Inc\Config;
use Inc\HttpClient;
use Inc\HttpResponse;
use JetBrains\PhpStorm\NoReturn;

/**
 * Mail controller class responsible for formating and forwarding data to Email API endpoint.
 */
class MailController extends BaseController
{
    private HttpClient $httpClient;

    public function __construct(?HttpClient $httpClient = null)
    {
        $this->httpClient = $httpClient ?? new HttpClient();
    }

    public function sendEmail(): void
    {
        $this->setSecurityHeaders();

        try {
            if (!$this->isRequestMethodAllowed('POST')) {
                $this->sendMethodNotAllowedResponse();
            }

            if ($this->getPostField('contactByFax') !== null) {
                $this->jsonResponse(['message' => 'Invalid submission'], 400);
            }

            $recipient = Config::$mailRecipient;
            $subject = 'Nachricht vom Kontaktformular';
            $name = $this->getPostField('name');
            $message = $this->getPostField('message');
            $email = $this->getPostField('email');

            if (!$this->validateParameters(is_string($email) ? $email : null, is_string($name) ? $name : null, is_string($message) ? $message : null)) {
                return;
            }

            $response = $this->httpClient->postForm(
                Config::$mailEndpoint,
                ['API-Key' => Config::$mailApiKey],
                [
                    'sender' => $email,
                    'recipient' => $recipient,
                    'subject' => $subject,
                    'message' => "EMAIL FROM CONTACT FORM\n\nNAME:\n$name\n\nEMAIL:\n$email\n\nMESSAGE:\n$message",
                ]
            );

            $this->sendResponse($response);
        } catch (\Throwable $exception) {
            $this->sendErrorResponse($exception);
        }
    }

    protected function getPostField(string $key): mixed
    {
        return $_POST[$key] ?? null;
    }

    #[NoReturn] private function sendResponse(HttpResponse $response): void
    {
        $statusCode = $response->statusCode;

        if ($statusCode === 200) {
            $this->sendSuccessResponse(['message' => 'Data forwarded successfully']);
        }

        $responseMessage = 'Error in forwarding data';
        $responseData = json_decode($response->body, true);
        if (is_array($responseData) && isset($responseData['message'])) {
            $responseMessage = (string) $responseData['message'];
        }

        $this->jsonResponse(['message' => $responseMessage], $statusCode);
    }

    private function validateParameters(?string $email, ?string $name, ?string $message): bool
    {
        $email = filter_var($email, FILTER_VALIDATE_EMAIL);
        $name = $this->sanitizeString($name, 200);
        $message = $this->sanitizeString($message);

        if (!$email || !$name || !$message) {
            $this->jsonResponse(['message' => 'Missing or invalid required parameters'], 400);
        }

        return true;
    }
}
