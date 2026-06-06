import type { Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, type Observable } from 'rxjs';

import type { LoadStatus } from './load-status.model';

export type LoadStatusSlice = {
  loadStatus: LoadStatus;
  error: unknown;
};

export type LoadStatusSignals = {
  loadStatus: Signal<LoadStatus>;
  error: Signal<unknown>;
};

/** Mappt NgRx-Load-Slices auf zwei Signals fuer PmAsyncContent. */
export function toLoadStatusSignals(state$: Observable<LoadStatusSlice>): LoadStatusSignals {
  return {
    loadStatus: toSignal(state$.pipe(map((state) => state.loadStatus)), {
      initialValue: 'PENDING',
    }),
    error: toSignal(state$.pipe(map((state) => state.error)), {
      initialValue: null,
    }),
  };
}
