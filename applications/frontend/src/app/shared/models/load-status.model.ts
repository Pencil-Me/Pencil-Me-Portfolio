import { DEFAULT_LOAD_ERROR } from '@app/shared/constants/user-messages';
import type { DomainLoadStatus } from '@app/shared/domain/portfolio-domain';

export type LoadStatus = DomainLoadStatus;

export function isLoadingStatus(status: LoadStatus | null | undefined): boolean {
  return status === 'PENDING' || status === 'LOADING';
}

export function isLoadSuccessful(status: LoadStatus | null | undefined): boolean {
  return status === 'COMPLETED';
}

export function hasLoadError(status: LoadStatus | null | undefined, error: unknown): boolean {
  if (status === 'ERROR') {
    return true;
  }

  // Fallback fuer veraltete States (COMPLETED + error)
  return status === 'COMPLETED' && error != null && error !== '';
}

export function toErrorMessage(error: unknown): string {
  if (error == null || error === '') {
    return DEFAULT_LOAD_ERROR;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return DEFAULT_LOAD_ERROR;
}
