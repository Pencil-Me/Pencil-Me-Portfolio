import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiClientService } from './api-client.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { expectHttpJsonResponse } from '../../../../testing/http-test.helpers';
import type { TestRequest } from '@angular/common/http/testing';

const apiUrl = (path: string): string => `${environment.API_BASE_URL}/${path}`;
const toUrlEncoded = (obj: Record<string, string | number>): string =>
  Object.keys(obj)
    .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]))
    .join('&');
interface ApiMessage {
  message: string;
}

describe('ApiClientService', () => {
  let service: ApiClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ApiClientService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ApiClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a GET request with proper headers', () => {
    const testData: ApiMessage = { message: 'Test data' };
    const path = 'test';

    service.get<ApiMessage>(path).subscribe((response) => {
      expect(response).toEqual(testData);
    });

    expectHttpJsonResponse(httpMock, apiUrl(path), 'GET', testData, (req: TestRequest) => {
      expect(req.request.headers.get('API-Key')).toBe('apikey123');
    });
  });

  it('should make a POST request with proper headers and data', () => {
    const testData: ApiMessage = { message: 'Test data' };
    const path = 'test';
    const postData = { name: 'John', age: 30 };

    service.post<ApiMessage>(path, postData).subscribe((response) => {
      expect(response).toEqual(testData);
    });

    expectHttpJsonResponse(httpMock, apiUrl(path), 'POST', testData, (req: TestRequest) => {
      expect(req.request.headers.get('API-Key')).toBe('apikey123');
      expect(req.request.body).toEqual(toUrlEncoded(postData));
    });
  });

  it('should make a PUT request with proper headers and data', () => {
    const testData: ApiMessage = { message: 'Test data' };
    const path = 'test';
    const putData = { name: 'John', age: 30 };

    service.put<ApiMessage>(path, putData).subscribe((response) => {
      expect(response).toEqual(testData);
    });

    expectHttpJsonResponse(httpMock, apiUrl(path), 'PUT', testData, (req: TestRequest) => {
      expect(req.request.headers.get('API-Key')).toBe('apikey123');
      expect(req.request.body).toEqual(putData);
    });
  });

  it('should make a DELETE request with proper headers and data', () => {
    const testData: ApiMessage = { message: 'Test data' };
    const path = 'test';

    service.delete<ApiMessage>(path).subscribe((response) => {
      expect(response).toEqual(testData);
    });

    expectHttpJsonResponse(httpMock, apiUrl(path), 'DELETE', testData, (req: TestRequest) => {
      expect(req.request.headers.get('API-Key')).toBe('apikey123');
    });
  });

  // Add more test cases for other methods (put, delete) similarly...
});
