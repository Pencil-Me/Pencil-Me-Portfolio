import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiErrorInterceptor } from './api-error.interceptor';

describe('apiErrorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let consoleErrorSpy: jasmine.Spy;

  function latestLogPayload(): Record<string, unknown> {
    return JSON.parse(consoleErrorSpy.calls.mostRecent().args[0] as string) as Record<
      string,
      unknown
    >;
  }

  beforeEach(() => {
    consoleErrorSpy = spyOn(console, 'error');
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([apiErrorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should pass through successful responses without logging', () => {
    http.get('/api/test').subscribe((data) => {
      expect(data).toEqual({ ok: true });
    });

    httpMock.expectOne('/api/test').flush({ ok: true });
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('should log structured entries and rethrow 4xx errors', (done) => {
    http.get('/api/test').subscribe({
      next: () => fail('expected error'),
      error: (error) => {
        expect(error.status).toBe(404);
        expect(consoleErrorSpy).toHaveBeenCalled();
        const payload = latestLogPayload();
        expect(payload['scope']).toBe('api');
        expect(payload['method']).toBe('GET');
        expect(payload['url']).toBe('/api/test');
        expect(payload['status']).toBe(404);
        done();
      },
    });

    httpMock
      .expectOne('/api/test')
      .flush({ message: 'Not found' }, { status: 404, statusText: 'Not Found' });
  });

  it('should log structured entries and rethrow 5xx errors', (done) => {
    http.get('/api/test').subscribe({
      next: () => fail('expected error'),
      error: (error) => {
        expect(error.status).toBe(500);
        const payload = latestLogPayload();
        expect(payload['message']).toBe('Server error');
        done();
      },
    });

    httpMock
      .expectOne('/api/test')
      .flush('Server error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should log structured entries and rethrow network errors', (done) => {
    http.get('/api/test').subscribe({
      next: () => fail('expected error'),
      error: (error) => {
        expect(error.status).toBe(0);
        const payload = latestLogPayload();
        expect(payload['message']).toBe('Server nicht erreichbar.');
        done();
      },
    });

    httpMock.expectOne('/api/test').error(new ProgressEvent('error'), {
      status: 0,
      statusText: 'Unknown Error',
    });
  });
});
