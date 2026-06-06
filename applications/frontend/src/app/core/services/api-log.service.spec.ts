import { TestBed } from '@angular/core/testing';

import { ApiLogService } from './api-log.service';

describe('ApiLogService', () => {
  let service: ApiLogService;
  let consoleErrorSpy: jasmine.Spy;

  beforeEach(() => {
    consoleErrorSpy = spyOn(console, 'error');
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiLogService);
  });

  it('should write structured JSON log entries', () => {
    service.logHttpError({
      method: 'GET',
      url: '/api/test',
      message: 'Not found',
      status: 404,
    });

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(consoleErrorSpy.calls.mostRecent().args[0] as string);
    expect(payload.scope).toBe('api');
    expect(payload.level).toBe('error');
    expect(payload.method).toBe('GET');
    expect(payload.url).toBe('/api/test');
    expect(payload.message).toBe('Not found');
    expect(payload.status).toBe(404);
    expect(payload.timestamp).toBeTruthy();
  });
});
