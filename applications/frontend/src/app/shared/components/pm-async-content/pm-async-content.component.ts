import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import {
  hasLoadError,
  isLoadingStatus,
  toErrorMessage,
  type LoadStatus,
} from '@app/shared/models/load-status.model';

export type PmAsyncVariant =
  | 'spinner'
  | 'skill-grid'
  | 'chips'
  | 'featured'
  | 'project-grid'
  | 'ticker'
  | 'detail';

@Component({
  selector: 'app-pm-async-content',
  templateUrl: './pm-async-content.component.html',
  styleUrl: './pm-async-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PmAsyncContentComponent {
  @Input() status: LoadStatus = 'PENDING';
  @Input() error: unknown = null;
  @Input() variant: PmAsyncVariant = 'spinner';
  @Input() label = 'Lade Daten';
  @Input() minHeight = '';
  @Input() showRetry = false;
  @Output() retry = new EventEmitter<void>();

  get isLoading(): boolean {
    return isLoadingStatus(this.status);
  }

  get hasError(): boolean {
    return hasLoadError(this.status, this.error);
  }

  get errorMessage(): string {
    return toErrorMessage(this.error);
  }

  get showContent(): boolean {
    return !this.isLoading && !this.hasError;
  }
}
