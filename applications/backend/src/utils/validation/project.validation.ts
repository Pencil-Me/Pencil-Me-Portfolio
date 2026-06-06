import type { TProject } from '@/types/project'
import { invalid, valid, type ValidationResult } from '@/utils/validation/types'

export function validateProject(project: TProject): ValidationResult {
  if (project.name.trim() === '') {
    return invalid('Bitte Name ausfüllen.')
  }
  if (project.type < 0) {
    return invalid('Bitte Typ auswählen.')
  }
  return valid()
}
