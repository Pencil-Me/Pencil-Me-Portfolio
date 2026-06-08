<?php

namespace Inc;

final class HttpResponse
{
    public function __construct(
        public readonly int $statusCode,
        public readonly string $body
    ) {
    }

    public function isSuccess(): bool
    {
        return $this->statusCode >= 200 && $this->statusCode < 300;
    }
}
