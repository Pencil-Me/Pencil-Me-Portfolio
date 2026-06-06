import { formatDate } from '@/utils/date'
import type { TProject } from '@/types/project'
import { sortProjectsForList } from '@/utils/mappers/project.mapper'

export type TProjectListItem = TProject & {
  last_date: string | null
  dates: Array<{ start_date: string; end_date: string }>
}

export function mapProjectsForListDisplay(projects: TProject[]): TProjectListItem[] {
  return sortProjectsForList(projects).map((project) => {
    const sortedDates = [...project.dates].sort((a, b) => {
      const aEnd = a.end_date ?? ''
      const bEnd = b.end_date ?? ''
      if (aEnd < bEnd) return -1
      if (aEnd > bEnd) return 1
      return 0
    })

    const lastDate = sortedDates[sortedDates.length - 1]?.end_date ?? null

    return {
      ...project,
      position: project.position.replace(/\//g, ' / '),
      last_date: lastDate,
      dates: sortedDates.map((date) => ({
        start_date: formatDate(date.start_date),
        end_date: date.end_date ? formatDate(date.end_date) : 'heute'
      }))
    }
  })
}
