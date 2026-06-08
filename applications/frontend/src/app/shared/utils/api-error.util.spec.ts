import { HttpErrorResponse } from '@angular/common/http';

import { DEFAULT_LOAD_ERROR } from '@app/shared/constants/user-messages';

import { mapApiError } from './api-error.util';

describe('mapApiError', () => {
  it('should return string errors unchanged', () => {
    expect(mapApiError('Server error')).toBe('Server error');
  });

  it('should extract error field from HttpErrorResponse', () => {
    const error = new HttpErrorResponse({
      status: 400,
      statusText: 'Bad Request',
      error: { error: 'Honeypot triggered' },
    });

    expect(mapApiError(error)).toBe('Honeypot triggered');
  });

  it('should extract message from HttpErrorResponse', () => {
    const error = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
      error: { message: 'DB connection failed' },
    });

    expect(mapApiError(error)).toBe('DB connection failed');
  });

  it('should handle network errors', () => {
    const error = new HttpErrorResponse({ status: 0, statusText: 'Unknown Error' });
    expect(mapApiError(error)).toBe('Server nicht erreichbar.');
  });

  it('should extract plain-text body from HttpErrorResponse', () => {
    const error = new HttpErrorResponse({
      status: 400,
      statusText: 'Bad Request',
      error: '  Ungueltige Eingabe  ',
    });

    expect(mapApiError(error)).toBe('  Ungueltige Eingabe  ');
  });

  it('should fall back to HTTP status message', () => {
    const error = new HttpErrorResponse({
      status: 404,
      statusText: 'Not Found',
      error: null,
    });

    expect(mapApiError(error)).toContain('404');
  });

  it('should return default message for unknown errors', () => {
    expect(mapApiError({ code: 42 })).toBe(DEFAULT_LOAD_ERROR);
  });

  it('should ignore object bodies without string message', () => {
    const error = new HttpErrorResponse({
      status: 422,
      statusText: 'Unprocessable Entity',
      error: { code: 'VALIDATION' },
    });

    expect(mapApiError(error)).toContain('422');
  });

  it('should ignore non-string message fields', () => {
    const error = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
      error: { message: 42 },
    });

    expect(mapApiError(error)).toContain('500');
  });

  it('should ignore whitespace-only plain-text bodies', () => {
    const error = new HttpErrorResponse({
      status: 400,
      statusText: 'Bad Request',
      error: '   ',
    });

    expect(mapApiError(error)).toContain('400');
  });

  it('should handle Error instances', () => {
    expect(mapApiError(new Error('Timeout'))).toBe('Timeout');
  });
});
