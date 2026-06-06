import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { scheduleAfterPaint, scheduleIdleWork } from '@app/shared/utils/schedule-idle';
import type { AppState } from '@app/state';
import { fromKnowledge } from '@app/state/knowledge';

/**
 * Laedt Portfolio-Daten einmalig beim App-Start.
 * Kritische Home-Daten nach dem ersten Paint, Projekte erst im Idle.
 */
@Injectable({ providedIn: 'root' })
export class KnowledgeBootstrapService {
  private store = inject<Store<AppState>>(Store);
  private bootstrapped = false;

  ensureLoaded(): void {
    if (this.bootstrapped) {
      return;
    }
    this.bootstrapped = true;

    scheduleAfterPaint(() => {
      this.store.dispatch(fromKnowledge.actions.GetTechstack());
      this.store.dispatch(fromKnowledge.actions.GetCustomers());
    });

    scheduleIdleWork(() => {
      this.store.dispatch(fromKnowledge.actions.GetProjects());
    }, 2500);
  }
}
