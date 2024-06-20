export interface ITechStack {
  id?: string
  name?: string
  type?: string
  expertise_level?: string
  last_usage?: string
  flag_important?: boolean
  project_count?: string
}
export type TTechStack = Required<Omit<ITechStack, 'id'|'last_usage'|'project_count'>> & {
  id?: string
  last_usage?: string
  project_count?: string
}
export function convertITechStackToTTechStack(payload: ITechStack): TTechStack {
  return {
    id: payload.id,
    name: payload.name ?? '',
    type: payload.type ?? '',
    expertise_level: payload.expertise_level ?? '',
    last_usage: payload.last_usage,
    flag_important: payload.flag_important ?? false,
    project_count: payload.project_count,
  }
}
export interface ITechStackTypes {
  id?: string;
  type?: string;
}
export type TTechStackTypes = Required<ITechStackTypes>
export function convertITechStackTypesToTTechStackTypes(payload: ITechStackTypes): TTechStackTypes {
  return {
    id: payload.id ?? '',
    type: payload.type ?? '',
  }
}
