<?php

namespace Controller\Api;

use Inc\AppLogger;
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
            if (!$this->isRequestMethodAllowed('POST')) {
                $this->sendMethodNotAllowedResponse();
            }

            $mail = new PHPMailer(true);

            $sender = $_POST["sender"] ?? null;
            $recipient = $_POST["recipient"] ?? null;
            $subject = $_POST["subject"] ?? null;
            $message = $_POST["message"] ?? null;

            if (!$this->validateParameters($sender, $recipient, $subject, $message)) {
                return;
            }

            $this->configureMailer($mail);

            $mail->setFrom($mail->Username);
            $mail->addAddress($recipient);

            $mail->Subject = $subject;
            $mail->Body = "Sender: $sender\n\nMessage:\n$message";

            try {
                $mail->send();
                $this->sendSuccessResponse(['message' => 'Email sent']);
            } catch (Exception $e) {
                AppLogger::error('PHPMailer send failed', [
                    'error_info' => $mail->ErrorInfo,
                    'exception' => $e->getMessage(),
                ]);
                $this->sendGenericErrorResponse(
                    'E-Mail konnte nicht gesendet werden.',
                    500
                );
            }
        } catch (Exception $exception) {
            AppLogger::error('MailController unexpected error', [
                'exception' => $exception->getMessage(),
            ]);
            $this->sendGenericErrorResponse(
                'E-Mail konnte nicht gesendet werden.',
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
            $this->sendOutput(['message' => 'Missing required parameters'], 400);
            return false;
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
        $mail->isSMTP();
        $mail->Host = Config::$mailHost;
        $mail->SMTPAuth = true;
        $mail->Username = Config::$mailUsername;
        $mail->Password = Config::$mailPassword;
        $mail->SMTPSecure = 'tls';
        $mail->Port = (int) Config::$mailPort;
    }
}
