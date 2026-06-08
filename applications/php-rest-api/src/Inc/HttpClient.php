<?php

namespace Inc;

/**
 * Minimale HTTP-Client-Huelle (curl) — Ersatz fuer Guzzle im Deploy.
 */
final class HttpClient
{
    public function get(string $url, array $headers = []): HttpResponse
    {
        return $this->request('GET', $url, $headers);
    }

    /**
     * @param array<string, string> $headers
     * @param array<string, string> $form
     */
    public function postForm(string $url, array $headers, array $form): HttpResponse
    {
        return $this->request('POST', $url, $headers, http_build_query($form));
    }

    private function request(string $method, string $url, array $headers = [], ?string $body = null): HttpResponse
    {
        if (!function_exists('curl_init')) {
            throw new \RuntimeException('PHP curl extension fehlt');
        }

        $ch = curl_init($url);
        if ($ch === false) {
            throw new \RuntimeException('curl_init fehlgeschlagen');
        }

        $headerLines = [];
        foreach ($headers as $name => $value) {
            $headerLines[] = $name . ': ' . $value;
        }

        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_HTTPHEADER => $headerLines,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_FOLLOWLOCATION => false,
        ]);

        if ($body !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
        }

        $responseBody = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($responseBody === false) {
            throw new \RuntimeException('HTTP request failed: ' . $error);
        }

        return new HttpResponse($status, (string) $responseBody);
    }
}
