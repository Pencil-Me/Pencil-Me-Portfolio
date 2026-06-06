import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { toLoadStatusSignals, type LoadStatusSlice } from './load-status.signals';

describe('toLoadStatusSignals', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should expose initial PENDING and null error', () => {
    const state$ = new BehaviorSubject<LoadStatusSlice>({
      loadStatus: 'COMPLETED',
      error: null,
    });

    const signals = TestBed.runInInjectionContext(() => toLoadStatusSignals(state$.asObservable()));

    expect(signals.loadStatus()).toBe('COMPLETED');
    expect(signals.error()).toBeNull();
  });

  it('should update when state emits', () => {
    const state$ = new BehaviorSubject<LoadStatusSlice>({
      loadStatus: 'LOADING',
      error: null,
    });

    const signals = TestBed.runInInjectionContext(() => toLoadStatusSignals(state$.asObservable()));

    state$.next({ loadStatus: 'ERROR', error: 'API down' });

    expect(signals.loadStatus()).toBe('ERROR');
    expect(signals.error()).toBe('API down');
  });
});
