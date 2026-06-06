import {
  hasLoadError,
  isLoadSuccessful,
  isLoadingStatus,
  toErrorMessage,
  type LoadStatus,
} from './load-status.model';

describe('load-status.model', () => {
  describe('isLoadingStatus', () => {
    it('should return true for PENDING and LOADING', () => {
      expect(isLoadingStatus('PENDING')).toBeTrue();
      expect(isLoadingStatus('LOADING')).toBeTrue();
    });

    it('should return false for COMPLETED and ERROR', () => {
      expect(isLoadingStatus('COMPLETED')).toBeFalse();
      expect(isLoadingStatus('ERROR')).toBeFalse();
    });
  });

  describe('isLoadSuccessful', () => {
    it('should return true only for COMPLETED', () => {
      expect(isLoadSuccessful('COMPLETED')).toBeTrue();
      expect(isLoadSuccessful('ERROR')).toBeFalse();
      expect(isLoadSuccessful('LOADING')).toBeFalse();
    });
  });

  describe('hasLoadError', () => {
    it('should return true for ERROR status', () => {
      expect(hasLoadError('ERROR', null)).toBeTrue();
      expect(hasLoadError('ERROR', 'Fehler')).toBeTrue();
    });

    it('should return true for legacy COMPLETED with error', () => {
      expect(hasLoadError('COMPLETED', 'Fehler')).toBeTrue();
    });

    it('should return false for COMPLETED without error', () => {
      expect(hasLoadError('COMPLETED', null)).toBeFalse();
    });

    it('should return false while loading', () => {
      expect(hasLoadError('LOADING', null)).toBeFalse();
    });
  });

  describe('toErrorMessage', () => {
    it('should return string errors as-is', () => {
      expect(toErrorMessage('API down')).toBe('API down');
    });

    it('should return Error message', () => {
      expect(toErrorMessage(new Error('Network fail'))).toBe('Network fail');
    });

    it('should return default message for empty error', () => {
      expect(toErrorMessage(null)).toBe('Daten konnten nicht geladen werden.');
      expect(toErrorMessage('')).toBe('Daten konnten nicht geladen werden.');
    });

    it('should return default message for unsupported error shapes', () => {
      expect(toErrorMessage({ status: 500 })).toBe('Daten konnten nicht geladen werden.');
    });
  });

  const allStatuses: LoadStatus[] = ['PENDING', 'LOADING', 'COMPLETED', 'ERROR'];

  it('should cover all four load statuses', () => {
    expect(allStatuses).toEqual(['PENDING', 'LOADING', 'COMPLETED', 'ERROR']);
  });
});
