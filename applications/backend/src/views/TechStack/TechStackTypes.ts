export interface ITechStack {
  uuid: string
  name?: string
  type?: string
  expertise_level?: string
  last_usage?: string
  flag_important?: boolean
  project_count?: string
}
export type TTechStack = Required<Omit<ITechStack, 'uuid'|'last_usage'|'project_count'>> & {
  id?: string
  last_usage?: string
  project_count?: string
}
export function convertITechStackToTTechStack(payload: ITechStack): TTechStack {
  return {
    id: payload.uuid,
    name: payload.name ?? '',
    type: payload.type ?? '',
    expertise_level: payload.expertise_level ?? '',
    last_usage: payload.last_usage,
    flag_important: payload.flag_important ?? false,
    project_count: payload.project_count,
  }
}
export interface ITechStackTypes {
  uuid: string;
  type?: string;
}
export type TTechStackTypes = Required<Omit<ITechStackTypes, 'uuid'>> & {
  id?: string;
}
export function convertITechStackTypesToTTechStackTypes(payload: ITechStackTypes): TTechStackTypes {
  return {
    id: payload.uuid ?? '',
    type: payload.type ?? '',
  }
}
