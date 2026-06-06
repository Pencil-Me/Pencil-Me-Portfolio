import { Injectable } from '@angular/core';

export type ApiLogContext = {
  method: string;
  url: string;
  message: string;
  status?: number;
};

@Injectable({ providedIn: 'root' })
export class ApiLogService {
  logHttpError(context: ApiLogContext): void {
    const entry = {
      scope: 'api',
      level: 'error' as const,
      timestamp: new Date().toISOString(),
      ...context,
    };

    console.error(JSON.stringify(entry));
  }
}
