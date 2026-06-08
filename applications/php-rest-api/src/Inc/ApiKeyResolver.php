<?php

namespace Inc;

/**
 * API-Key aus Header, Query oder Form-Body (Preflight-freundlich fuer Cross-Origin).
 */
final class ApiKeyResolver
{
  public static function resolve(): string
  {
    $header = $_SERVER['HTTP_API_KEY'] ?? '';
    if (is_string($header) && $header !== '') {
      return $header;
    }

    $query = $_GET['api_key'] ?? $_GET['api-key'] ?? '';
    if (is_string($query) && $query !== '') {
      return $query;
    }

    $body = $_POST['api_key'] ?? $_POST['api-key'] ?? '';
    if (is_string($body) && $body !== '') {
      return $body;
    }

    return '';
  }
}
