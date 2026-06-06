<?php

namespace Controller\Api;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Inc\Config;
use JetBrains\PhpStorm\NoReturn;
use Psr\Http\Message\ResponseInterface;

/**
 * Mail controller class responsible for formating and forwarding data to Email API endpoint.
 */
class MailController extends BaseController
{
    private Client $httpClient;

    public function __construct(?Client $httpClient = null)
    {
        $this->httpClient = $httpClient ?? new Client();
    }

    public function sendEmail(): void
    {
        $this->setSecurityHeaders();

        if (!$this->checkRateLimit()) {
            return;
        }

        try {
            if (!$this->isRequestMethodAllowed('POST')) {
                $this->sendMethodNotAllowedResponse();
            }

            $honeyPotValueIsSet = $_POST['contactByFax'] ?? false;
            if ($honeyPotValueIsSet) {
                $this->jsonResponse(['message' => 'It´s a Trap'], 401);
            }

            $recipient = Config::$mailRecipient;
            $subject = 'Nachricht vom Kontaktformular';
            $name = $_POST['name'] ?? null;
            $message = $_POST['message'] ?? null;
            $email = $_POST['email'] ?? null;

            if (!$this->validateParameters($email, $name, $message)) {
                return;
            }

            $endpoint = Config::$mailEndpoint;
            $postData = [
                'headers' => [
                    'API-Key' => Config::$mailApiKey,
                ],
                'form_params' => [
                    'sender' => $email,
                    'recipient' => $recipient,
                    'subject' => $subject,
                    'message' => "EMAIL FROM CONTACT FORM\n\nNAME:\n$name\n\nEMAIL:\n$email\n\nMESSAGE:\n$message"
                ],
            ];

            $response = $this->httpClient->post($endpoint, $postData);
            $this->sendResponse($response);
        } catch (GuzzleException $exception) {
            $this->sendErrorResponse($exception);
        }
    }

    #[NoReturn] private function sendResponse(ResponseInterface $response): void
    {
        $statusCode = $response->getStatusCode();

        if ($statusCode === 200) {
            $this->sendSuccessResponse(['message' => 'Data forwarded successfully']);
        }

        $responseMessage = 'Error in forwarding data';
        $responseData = json_decode((string) $response->getBody(), true);
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
