export interface ITech {
  uuid: string
  name?: string
  type?: string
  expertise_level?: string
  flag_important?: string | boolean
  last_usage?: string
  project_count?: string
}

export type TTech = {
  id: string
  name: string
  type: string
  expertise_level: string
  flag_important: string | boolean
  last_usage?: string
  project_count?: string
}

export function convertITechToTTech(payload: ITech): TTech {
  return {
    id: payload.uuid ?? '',
    name: payload.name ?? '',
    type: payload.type ?? '',
    expertise_level: payload.expertise_level ?? '',
    flag_important: payload.flag_important ?? '',
    last_usage: payload.last_usage,
    project_count: payload.project_count
  }
}
