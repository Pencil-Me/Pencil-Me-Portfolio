import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  baseUrl: string = environment.API_BASE_URL;
  apiKey: string = environment.API_KEY;

  constructor(private http: HttpClient) {}

  /**
   * Wrapper for GET method of HTTPClient with composed URL
   * @param path of API
   * @param options the HTTP options to send with the request.
   * @returns Observable of generic T
   */
  public get<T>(path: string, options?: Record<string, unknown>): Observable<T> {
    const headers = new HttpHeaders()
      .set('API-Key', this.apiKey)
      .set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.get<T>(this.composeApiUrl(path), { headers, ...options });
  }

  /**
   * Wrapper for POST method of HTTPClient with composed URL
   * @param path of API
   * @param data object with complete model
   * @param options The HTTP options to send with the request.
   * @returns Observable of generic T
   */
  public post<T>(path: string, data?: object, options?: Record<string, unknown>): Observable<T> {
    const headers = new HttpHeaders()
      .set('API-Key', this.apiKey)
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const body = this.encodeFormData(data);
    return this.http.post<T>(this.composeApiUrl(path), body, { headers, ...options });
  }

  /**
   * Encodes the provided data object into URL-encoded form data
   * @param data object with complete model
   * @returns URL-encoded form data
   */
  private encodeFormData(data?: { [key: string]: any }): string {
    if (!data) return '';
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
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
    const headers = new HttpHeaders()
      .set('API-Key', this.apiKey)
      .set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.put<T>(this.composeApiUrl(path), data, { headers, ...options });
  }

  /**
   * Wrapper for DELETE method of HTTPClient with composed URL
   * @param path of API
   * @param options The HTTP options to send with the request.
   * @returns Observable of generic
   */
  public delete<T>(path: string, options?: Record<string, unknown>): Observable<T> {
    const headers = new HttpHeaders()
      .set('API-Key', this.apiKey)
      .set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.delete<T>(this.composeApiUrl(path), { headers, ...options });
  }

  /**
   * Compose the Complete URL for the API call
   * e.g. test -> https://baseurl.com/test
   * @param path of the URL that should be called
   * @returns the complete URL for API call
   */
  private composeApiUrl(path: string): string {
    return `${this.baseUrl}/${path}`;
  }
}
