<?php

namespace Inc;

use PHPMailer\PHPMailer\Exception as PhpmailerException;
use PHPMailer\PHPMailer\PHPMailer;

/**
 * PHPMailer-backed SMTP transport.
 */
class PhpmailerMailSender implements MailSenderInterface
{
    public function send(string $sender, string $recipient, string $subject, string $messageBody): void
    {
        $mail = new PHPMailer(true);

        try {
            $this->configureMailer($mail);

            $fromAddress = Config::$mailSender !== '' ? Config::$mailSender : Config::$mailUsername;
            $fromName = Config::$mailFromName !== '' ? Config::$mailFromName : Config::$mailUsername;

            $mail->setFrom($fromAddress, $fromName);
            $mail->addReplyTo($sender);
            $mail->addAddress($recipient);
            $mail->Subject = $subject;
            $mail->Body = "Sender: $sender\n\nMessage:\n$messageBody";
            $mail->CharSet = PHPMailer::CHARSET_UTF8;

            $mail->send();
        } catch (PhpmailerException $exception) {
            throw new MailSendException(
                $exception->getMessage(),
                $mail->ErrorInfo,
                $exception
            );
        }
    }

    private function configureMailer(PHPMailer $mail): void
    {
        $mail->isSMTP();
        $mail->Host = Config::$mailHost;
        $mail->SMTPAuth = true;
        $mail->Username = Config::$mailUsername;
        $mail->Password = Config::$mailPassword;
        $mail->Port = (int) Config::$mailPort;

        $secure = Config::$mailSmtpSecure;
        if ($secure === 'tls' || $secure === 'ssl') {
            $mail->SMTPSecure = $secure;
        }

        if (Config::getLogLevel() === 'DEBUG') {
            $mail->SMTPDebug = 2;
            $mail->Debugoutput = static function (string $str, int $level): void {
                AppLogger::debug('PHPMailer SMTP', ['level' => $level, 'detail' => trim($str)]);
            };
        }
    }
}
