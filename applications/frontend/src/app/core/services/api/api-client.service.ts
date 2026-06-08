import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  private http = inject(HttpClient);

  baseUrl: string = environment.API_BASE_URL;
  apiKey: string = environment.API_KEY;

  /**
   * Cross-Origin ohne Custom-Header -> kein OPTIONS-Preflight (Shared Hosting).
   * Relativ (/api2) oder explizit false: weiterhin Header API-Key.
   */
  private useQueryKey(): boolean {
    if (environment.API_KEY_IN_QUERY === true) {
      return true;
    }
    if (environment.API_KEY_IN_QUERY === false) {
      return false;
    }
    return /^https?:\/\//i.test(this.baseUrl);
  }

  /**
   * Wrapper for GET method of HTTPClient with composed URL
   * @param path of API
   * @param options the HTTP options to send with the request.
   * @returns Observable of generic T
   */
  public get<T>(path: string, options?: Record<string, unknown>): Observable<T> {
    const url = this.useQueryKey()
      ? this.appendApiKeyToUrl(this.composeApiUrl(path))
      : this.composeApiUrl(path);
    const headers = this.useQueryKey() ? undefined : new HttpHeaders().set('API-Key', this.apiKey);
    return this.http.get<T>(url, { ...(headers ? { headers } : {}), ...options });
  }

  /**
   * Wrapper for POST method of HTTPClient with composed URL
   * @param path of API
   * @param data object with complete model
   * @param options The HTTP options to send with the request.
   * @returns Observable of generic T
   */
  public post<T>(path: string, data?: object, options?: Record<string, unknown>): Observable<T> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    if (!this.useQueryKey()) {
      headers = headers.set('API-Key', this.apiKey);
    }
    const payload = this.useQueryKey() ? { ...data, api_key: this.apiKey } : data;
    const body = this.encodeFormData(payload);
    return this.http.post<T>(this.composeApiUrl(path), body, { headers, ...options });
  }

  /**
   * Encodes the provided data object into URL-encoded form data
   * @param data object with complete model
   * @returns URL-encoded form data
   */
  private encodeFormData(data?: object): string {
    if (!data) return '';
    return Object.entries(data)
      .map(([key, value]) => {
        const encoded =
          value === null || value === undefined
            ? ''
            : typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
              ? String(value)
              : '';
        return encodeURIComponent(key) + '=' + encodeURIComponent(encoded);
      })
      .join('&');
  }

  /**
   * Wrapper for PUT method of HTTPClient with composed URL
   * @param path of API
   * @param data object with only changes
   * @param options The HTTP options to send with the request.
   * @returns Observable of generic T
   */
  public put<T>(path: string, data: object, options?: Record<string, unknown>): Observable<T> {
    if (options === undefined) options = {};
    const url = this.useQueryKey()
      ? this.appendApiKeyToUrl(this.composeApiUrl(path))
      : this.composeApiUrl(path);
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    if (!this.useQueryKey()) {
      headers = headers.set('API-Key', this.apiKey);
    }
    return this.http.put<T>(url, data, { headers, ...options });
  }

  /**
   * Wrapper for DELETE method of HTTPClient with composed URL
   * @param path of API
   * @param options The HTTP options to send with the request.
   * @returns Observable of generic
   */
  public delete<T>(path: string, options?: Record<string, unknown>): Observable<T> {
    const url = this.useQueryKey()
      ? this.appendApiKeyToUrl(this.composeApiUrl(path))
      : this.composeApiUrl(path);
    const headers = this.useQueryKey() ? undefined : new HttpHeaders().set('API-Key', this.apiKey);
    return this.http.delete<T>(url, { ...(headers ? { headers } : {}), ...options });
  }

  /**
   * Compose the Complete URL for the API call
   * e.g. test -> https://baseurl.com/test
   * @param path of the URL that should be called
   * @returns the complete URL for API call
   */
  private composeApiUrl(path: string): string {
    const base = this.baseUrl.replace(/\/+$/, '');
    const route = path.replace(/^\/+/, '');
    return `${base}/${route}`;
  }

  private appendApiKeyToUrl(url: string): string {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}api_key=${encodeURIComponent(this.apiKey)}`;
  }
}
