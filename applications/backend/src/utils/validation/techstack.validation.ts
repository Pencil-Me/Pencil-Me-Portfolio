import type { TTechStack } from '@/types/techstack'
import { invalid, valid, type ValidationResult } from '@/utils/validation/types'

export function validateTechStack(techStack: TTechStack): ValidationResult {
  if (techStack.name.trim() === '') {
    return invalid('Bitte Name ausfüllen.')
  }
  if (techStack.type === '') {
    return invalid('Bitte Typ auswählen.')
  }
  if (techStack.expertise_level.trim() === '') {
    return invalid('Bitte Erfahrungslevel ausfüllen.')
  }
  return valid()
}
