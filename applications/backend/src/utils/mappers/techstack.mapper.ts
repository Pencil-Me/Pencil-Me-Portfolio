import { TechStackTypeLabel } from '@/types/enums'
import type { TSelectOption } from '@/types/select-option'
import type { TTechStack, TTechStackTypes } from '@/types/techstack'

export function cloneTechStack(techStack: TTechStack): TTechStack {
  return { ...techStack }
}

export function normalizeTechStack(item: TTechStack): TTechStack {
  return {
    id: item.id,
    name: item.name ?? '',
    type: item.type ?? '',
    expertise_level: item.expertise_level ?? '',
    flag_important: item.flag_important ?? false,
    project_count: item.project_count,
    last_usage: item.last_usage
  }
}

export function normalizeTechStacks(items: TTechStack[]): TTechStack[] {
  return items.map((item) => normalizeTechStack(item))
}

export function mapTechStackTypesToSelectOptions(types: TTechStackTypes[]): TSelectOption[] {
  return types.map((entry) => ({
    value: entry.id ?? '',
    label: TechStackTypeLabel[entry.type as keyof typeof TechStackTypeLabel] ?? entry.type ?? ''
  }))
}
