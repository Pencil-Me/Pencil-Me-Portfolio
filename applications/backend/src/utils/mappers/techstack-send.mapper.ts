import type { ITechStack, TTechStack } from '@/types/techstack'

export function convertTTechStackToSendPayload(payload: TTechStack): ITechStack {
  return {
    uuid: payload.id ?? undefined,
    name: payload.name ?? '',
    type: payload.type ?? '',
    expertise_level: payload.expertise_level ?? '',
    flag_important: payload.flag_important
  }
}
