export interface IDates {
  start_date?: string | null
  end_date?: string | null
}
export type TDates = Required<IDates>
export function convertIDatesToTDates(payload: IDates): TDates {
  return {
    start_date: payload.start_date ?? null,
    end_date: payload.end_date ?? null,
  }
}
export interface ITech {
  uuid: string
  name?: string
  type?: string
  expertise_level?: string
}
export type TTech = Required<Omit<ITech, 'uuid'>> & {
  id?: string
}
export function convertITechToTTech(payload: ITech): TTech {
  return {
    id: payload.uuid ?? '',
    name: payload.name ?? '',
    type: payload.type ?? '',
    expertise_level: payload.expertise_level ?? '',
  }
}
export interface ICustomer {
  uuid: string
  name: string
  location: string
}
export type TCustomer = Required<Omit<ICustomer, 'uuid'>> & {
  id?: string
}
export function convertICustomerToTCustomer(payload: ICustomer): TCustomer {
  return {
    id: payload.uuid ?? '',
    name: payload.name ?? '',
    location: payload.location ?? '',
  }
}
export interface IProjectType {
  uuid: string;
  type?: string;
}
export type TProjectType = Required<Omit<IProjectType, 'uuid'>> & {
  id?: string
}
export function convertIProjectTypeToTProjectType(payload: IProjectType): TProjectType {
  return {
    id: payload.uuid ?? '',
    type: payload.type ?? '',
  }
}
export interface IProject {
  uuid: string;
  name?: string
  position?: string
  customer?: string
  location?: string
  content_short?: string
  content_long?: string
  content?: string
  type?: string
  customers?: ICustomer[]
  dates?: IDates[]
  tech?: ITech[]
  show?: boolean
}
export type TProject = Required<Omit<IProject, 'uuid'|'customers'|'dates'|'tech'>> & {
  id?: string
  customers: TCustomer[]
  dates: TDates[]
  tech: TTech[]
}
export function convertIProjectToTProject(payload: IProject): TProject {
  return {
    id: payload.uuid,
    name: payload.name ?? '',
    show: !!payload.show,
    position: payload.position ?? '',
    type: payload.type ?? '',
    customer: payload.customer ?? '',
    location: payload.location ?? '',
    content: payload.content ?? '',
    content_short: payload.content_short ?? '',
    content_long: payload.content_long ?? '',
    dates: payload.dates?.map(e => convertIDatesToTDates(e)) ?? [],
    tech: payload.tech?.map(e => convertITechToTTech(e)) ?? [],
    customers: payload.customers?.map(e => convertICustomerToTCustomer(e)) ?? []
  }
}
