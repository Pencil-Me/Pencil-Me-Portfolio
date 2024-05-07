<?php

namespace Controller\Api;

use Inc\Config;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

/**
 * MailController class handles functionality related to sending emails via API.
 */
class MailController extends BaseController
{
    /**
     * Sends an email using the provided parameters.
     */
    public function sendEmail(): void
    {
        try {
            // Check if the request method is POST
            if (!$this->isRequestMethodAllowed('POST')) {
                // Send error response for unsupported request method
                $this->sendMethodNotAllowedResponse();
            }

            // Initialize PHPMailer
            $mail = new PHPMailer(true);

            // Extract parameters from POST request
            $sender = $_POST["sender"] ?? null;
            $recipient = $_POST["recipient"] ?? null;
            $subject = $_POST["subject"] ?? null;
            $message = $_POST["message"] ?? null;

            // Validate required parameters
            if (!$this->validateParameters($sender, $recipient, $subject, $message))
            {
                exit();
            }

            // Configure PHPMailer
            $this->configureMailer($mail);

            // Set sender and recipient
            $mail->setFrom($mail->Username);
            $mail->addAddress($recipient);

            // Set email subject and body
            $mail->Subject = $subject;
            $mail->Body = "Sender: $sender\n\nMessage:\n$message";

            try {
                // Send the email
                $mail->send();

                // Send success response
                $this->sendSuccessResponse(['message' => 'Email sent']);
            } catch (Exception $e) {
                $this->sendOutput(
                    "An error occurred while sending the email: {$mail->ErrorInfo}",
                    400
                );
            }
        }
        catch (Exception $exception) {
            // Handle exceptions
            $this->sendOutput(
                $exception->getMessage() . ' Something went wrong! Please contact support.',
                500
            );
        }
    }

    /**
     * Validates the required parameters for sending an email.
     *
     * @param string|null $sender The email sender.
     * @param string|null $recipient The email recipient.
     * @param string|null $subject The email subject.
     * @param string|null $message The email message.
     * @return bool Returns true if parameters are valid, false otherwise.
     */
    private function validateParameters(?string $sender, ?string $recipient, ?string $subject, ?string $message): bool
    {
        if (!$sender || !$recipient || !$subject || !$message) {
            // If any of the required parameters are missing, return an error response
            $this->sendOutput([
                'message' => 'Missing required parameters',
                '$sender' => $sender,
                '$recipient' => $recipient,
                '$subject' => $subject,
                '$message' => $message
            ], 400);
        }
        return true;
    }

    /**
     * Configures PHPMailer for sending emails.
     *
     * @param PHPMailer $mail The PHPMailer instance.
     */
    private function configureMailer(PHPMailer $mail): void
    {
        $mail->isSMTP(); // Use SMTP
        $mail->Host = Config::$mailHost; // SMTP server address
        $mail->SMTPAuth = true; // Enable SMTP authentication
        $mail->Username = Config::$mailUsername; // SMTP username
        $mail->Password = Config::$mailPassword; // SMTP password
        $mail->SMTPSecure = 'tls'; // Encryption type
        $mail->Port = Config::$mailPort; // SMTP port
    }
}
