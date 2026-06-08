import { HttpErrorResponse } from '@angular/common/http';

import { DEFAULT_LOAD_ERROR } from '@app/shared/constants/user-messages';

function readStringBody(body: unknown): string | null {
  return typeof body === 'string' && body.trim() ? body : null;
}

function readObjectMessage(body: unknown): string | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  if ('message' in body && typeof body.message === 'string') {
    return body.message;
  }

  if ('error' in body && typeof body.error === 'string') {
    return body.error;
  }

  return null;
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

  return DEFAULT_LOAD_ERROR;
}
