export interface Environment {
  production: boolean;
  API_KEY: string;
  API_BASE_URL: string;
  /**
   * Cross-Origin: Key in URL/Body statt Header (kein OPTIONS-Preflight).
   * Weglassen = auto (true bei http(s):// API_BASE_URL).
   */
  API_KEY_IN_QUERY?: boolean;
}
