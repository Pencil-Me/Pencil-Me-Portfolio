import { formatIsoDate } from '@/utils/date'
import type { TCustomer } from '@/types/customer'
import type { TDates } from '@/types/dates'
import type { TProject, TProjectType } from '@/types/project'
import { ProjectTypeLabel } from '@/types/enums'
import type { TSelectOption } from '@/types/select-option'
import type { TTech } from '@/types/tech'

function sortDates(dates: TDates[]): TDates[] {
  return [...dates].sort((a, b) => {
    const aEnd = a.end_date ?? ''
    const bEnd = b.end_date ?? ''
    if (aEnd < bEnd) return -1
    if (aEnd > bEnd) return 1
    return 0
  })
}

function sortTech(tech: TTech[]): TTech[] {
  return [...tech].sort((a, b) => {
    if (a.type < b.type) return -1
    if (a.type > b.type) return 1
    if (a.name < b.name) return -1
    if (a.name > b.name) return 1
    return 0
  })
}

function sortCustomers(customers: TCustomer[]): TCustomer[] {
  return [...customers].sort((a, b) => {
    if (a.name < b.name) return -1
    if (a.name > b.name) return 1
    return 0
  })
}

export function cloneProject(project: TProject): TProject {
  return {
    ...project,
    dates: project.dates.map((entry) => ({ ...entry })),
    tech: project.tech.map((entry) => ({ ...entry })),
    customers: project.customers.map((entry) => ({ ...entry }))
  }
}

function normalizeProject(project: TProject): TProject {
  const content = project.content ?? ''
  return {
    ...project,
    content_short: project.content_short || content,
    content_long: project.content_long || content,
    dates: sortDates(project.dates),
    tech: sortTech(project.tech),
    customers: sortCustomers(project.customers)
  }
}

export function normalizeProjects(projects: TProject[]): TProject[] {
  return projects.map((project) => normalizeProject(project))
}

export function normalizeProjectForEdit(project: TProject): TProject {
  const normalized = normalizeProject(project)
  return {
    ...normalized,
    dates: normalized.dates.map((entry) => ({
      start_date: formatIsoDate(entry.start_date),
      end_date: formatIsoDate(entry.end_date)
    }))
  }
}

export function mapProjectTypesToSelectOptions(types: TProjectType[]): TSelectOption[] {
  return types.map((entry) => ({
    value: entry.id ?? '',
    label: ProjectTypeLabel[entry.type as keyof typeof ProjectTypeLabel] ?? entry.type ?? ''
  }))
}

function getProjectLastEndDate(project: TProject): string | null {
  const sorted = sortDates(project.dates)
  const last = sorted[sorted.length - 1]
  return last?.end_date ?? last?.start_date ?? null
}

export function sortProjectsForList(projects: TProject[]): TProject[] {
  return [...projects].sort((a, b) => {
    if (a.type < b.type) return -1
    if (a.type > b.type) return 1
    const aDate = getProjectLastEndDate(a)
    const bDate = getProjectLastEndDate(b)
    if (aDate && bDate) {
      if (new Date(aDate) > new Date(bDate)) return -1
      if (new Date(aDate) < new Date(bDate)) return 1
    }
    return 0
  })
}
