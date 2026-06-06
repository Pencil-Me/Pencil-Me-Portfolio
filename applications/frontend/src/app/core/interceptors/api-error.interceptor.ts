import { HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { ApiLogService } from '@core/services/api-log.service';
import { mapApiError } from '@app/shared/utils/api-error.util';

/**
 * Zentrales HTTP-Fehler-Logging. Fehler werden weiter an Subscriber/Effects gereicht.
 */
export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const apiLog = inject(ApiLogService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        apiLog.logHttpError({
          method: req.method,
          url: req.urlWithParams,
          message: mapApiError(error),
          status: error.status,
        });
      } else {
        apiLog.logHttpError({
          method: req.method,
          url: req.urlWithParams,
          message: error instanceof Error ? error.message : String(error),
        });
      }

      return throwError(() => error);
    }),
  );
};
