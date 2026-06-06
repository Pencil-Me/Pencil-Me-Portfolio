import { convertICustomerToTCustomer, type ICustomer, type TCustomer } from '@/types/customer'
import { convertIDatesToTDates, type IDates, type TDates } from '@/types/dates'
import { convertITechToTTech, type ITech, type TTech } from '@/types/tech'

export type { TCustomer, TDates, TTech }

export interface IProjectType {
  id: string
  type?: string
}

export type TProjectType = Required<Omit<IProjectType, 'uuid'>> & {
  id?: string
}

export function convertIProjectTypeToTProjectType(payload: IProjectType): TProjectType {
  return {
    id: payload.id ?? '',
    type: payload.type ?? ''
  }
}

export interface IProject {
  content?: string
  content_long?: string
  content_short?: string
  customer?: string
  customers?: ICustomer[]
  dates?: IDates[]
  location?: string
  name?: string
  position?: string
  public?: number
  tech?: ITech[]
  type?: number
  uuid?: string
}

export type TProject = Required<
  Omit<IProject, 'uuid' | 'customers' | 'dates' | 'tech' | 'public'>
> & {
  id?: string
  customers: TCustomer[]
  dates: TDates[]
  tech: TTech[]
  show: number
}

export function convertIProjectToTProject(payload: IProject): TProject {
  return {
    id: payload.uuid ?? undefined,
    name: payload.name ?? '',
    show: payload.public ?? 0,
    position: payload.position ?? '',
    type: payload.type ?? -1,
    customer: payload.customer ?? '',
    location: payload.location ?? '',
    content: payload.content ?? '',
    content_short: payload.content_short ?? '',
    content_long: payload.content_long ?? '',
    dates: payload.dates?.map((entry) => convertIDatesToTDates(entry)) ?? [],
    tech: payload.tech?.map((entry) => convertITechToTTech(entry)) ?? [],
    customers: payload.customers?.map((entry) => convertICustomerToTCustomer(entry)) ?? []
  }
}
