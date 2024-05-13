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
    /**
     * Forwards data to another API endpoint or sends an email.
     */
    public function sendEmail(): void
    {
        try {
            // Check if the request method is POST
            if (!$this->isRequestMethodAllowed('POST')) {
                // Send error response for unsupported request method
                $this->sendMethodNotAllowedResponse();
            }

            $honeyPotValueIsSet = $_POST['contactByFax'] ?? false;
            if ($honeyPotValueIsSet) {
                // If any of the required parameters are missing, return an error response
                $this->sendOutput(
                    json_encode(['message' => 'It´s a Trap']),
                    401
                );
            }

            // Extract parameters from POST request
            $recipient = Config::$mailRecipient;
            $subject = 'Nachricht vom Kontaktformular';
            $name = $_POST['name'] ?? null;
            $message = $_POST['message'] ?? null;
            $email = $_POST['email'] ?? null;

            // Check if required parameters are present
            if (!$this->validateParameters($email, $name, $message))
            {
                exit();
            }

            // Initialize Guzzle HTTP client
            $client = new Client();

            // Define the endpoint URL
            $endpoint = Config::$mailEndpoint;

            // Prepare request data
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

            // Send POST request to the endpoint with the provided data
            $response = $client->post($endpoint, $postData);

            $this->sendResponse($response);
        } catch (GuzzleException $exception) {
            // Error in making HTTP request
            $this->sendErrorResponse($exception);
        }
    }

    /**
     * Sends a response based on the provided ResponseInterface.
     *
     * @param ResponseInterface $response The response.
     */
    #[NoReturn] private function sendResponse(ResponseInterface $response): void {
        // Get the status code from the response
        $statusCode = $response->getStatusCode();

        // Send appropriate response based on the status code
        if ($statusCode === 200) {
            // Data forwarded successfully
            $this->sendSuccessResponse(['message' => 'Data forwarded successfully']);
        }

        // Error in forwarding data
        $responseMessage = 'Error in forwarding data';
        $responseData = json_decode($response->getBody(), true);
        if ($responseData && isset($responseData['message'])) {
            $responseMessage = $responseData['message'];
        }

        // Send response
        $this->sendOutput(
            ['message' => $responseMessage],
            $statusCode
        );
    }

    /**
     * Validates the required parameters for sending an email.
     *
     * @param string|null $email The email.
     * @param string|null $name The senders name.
     * @param string|null $message The message.
     */
    private function validateParameters(?string $email, ?string $name, ?string $message): bool
    {
        if (!$email || !$name || !$message) {
            // If any of the required parameters are missing, return an error response
            $this->sendOutput(json_encode([
                'message' => 'Missing required parameters',
                '$email' => $email,
                '$name' => $name,
                '$message' => $message
            ]), 400);
        }
        return true;
    }
}
