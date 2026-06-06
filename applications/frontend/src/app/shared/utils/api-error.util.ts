import { HttpErrorResponse } from '@angular/common/http';

const DEFAULT_API_ERROR = 'Daten konnten nicht geladen werden.';

function readStringBody(body: unknown): string | null {
  return typeof body === 'string' && body.trim() ? body : null;
}

function readObjectMessage(body: unknown): string | null {
  if (!body || typeof body !== 'object' || !('message' in body)) {
    return null;
  }

  const message = body.message;
  return typeof message === 'string' ? message : null;
}

function readHttpErrorMessage(error: HttpErrorResponse): string | null {
  return readStringBody(error.error) ?? readObjectMessage(error.error);
}

function httpErrorFallback(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'Server nicht erreichbar.';
  }

  return error.message || `HTTP ${error.status}`;
}

/**
 * Normalisiert HTTP- und RxJS-Fehler fuer NgRx-Failure-Actions und UI-Messages.
 */
export function mapApiError(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof HttpErrorResponse) {
    return readHttpErrorMessage(error) ?? httpErrorFallback(error);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return DEFAULT_API_ERROR;
}
