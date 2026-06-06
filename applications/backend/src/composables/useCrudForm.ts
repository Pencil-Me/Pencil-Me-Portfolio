import type { ValidationResult } from '@/utils/validation'

export type ValidatorFn<T> = (entity: T) => ValidationResult

export async function runValidatedAction<T>(
  entity: T,
  validate: ValidatorFn<T>,
  showError: (message: string) => void,
  action: () => Promise<void>,
  onSuccess?: () => void | Promise<unknown>
): Promise<boolean> {
  const result = validate(entity)
  if (!result.valid) {
    showError(result.message ?? 'Bitte Eingaben prüfen.')
    return false
  }

  try {
    await action()
    if (onSuccess) {
      await onSuccess()
    }
    return true
  } catch {
    return false
  }
}
