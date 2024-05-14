import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiClientService } from './api-client.service';

const toUrlEncoded = (obj: { [key: string]: string | number }) =>
  Object.keys(obj)
    .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]))
    .join('&');
describe('ApiClientService', () => {
  let service: ApiClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiClientService],
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
    const testData = { message: 'Test data' };
    const path = 'test';

    service.get<any>(path).subscribe((response) => {
      expect(response).toEqual(testData);
    });

    const req = httpMock.expectOne('https://api.pencil-me.eu/index.php/test');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('API-Key')).toBe('apikey123');
    req.flush(testData);
  });

  it('should make a POST request with proper headers and data', () => {
    const testData = { message: 'Test data' };
    const path = 'test';
    const postData = { name: 'John', age: 30 };

    service.post<any>(path, postData).subscribe((response) => {
      expect(response).toEqual(testData);
    });

    const req = httpMock.expectOne('https://api.pencil-me.eu/index.php/test');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('API-Key')).toBe('apikey123');
    expect(req.request.body).toEqual(toUrlEncoded(postData));
    req.flush(testData);
  });

  it('should make a PUT request with proper headers and data', () => {
    const testData = { message: 'Test data' };
    const path = 'test';
    const putData = { name: 'John', age: 30 };

    service.put<any>(path, putData).subscribe((response) => {
      expect(response).toEqual(testData);
    });

    const req = httpMock.expectOne('https://api.pencil-me.eu/index.php/test');
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('API-Key')).toBe('apikey123');
    expect(req.request.body).toEqual(putData);
    req.flush(testData);
  });

  it('should make a DELETE request with proper headers and data', () => {
    const testData = { message: 'Test data' };
    const path = 'test';

    service.delete<any>(path).subscribe((response) => {
      expect(response).toEqual(testData);
    });

    const req = httpMock.expectOne('https://api.pencil-me.eu/index.php/test');
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('API-Key')).toBe('apikey123');
    req.flush(testData);
  });

  // Add more test cases for other methods (put, delete) similarly...
});
