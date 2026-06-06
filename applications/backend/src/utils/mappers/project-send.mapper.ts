import type { TCustomer, TDates, TProject, TTech } from '@/types'

export function convertTDatesToSendPayload(payload: TDates) {
  return {
    start_date: payload.start_date ?? new Date(),
    end_date: payload.end_date ?? undefined
  }
}

export function convertTTechToSendPayload(payload: TTech) {
  return {
    id: payload.id,
    name: payload.name ?? '',
    type: payload.type ?? -1,
    expertise_level: payload.expertise_level ?? '0'
  }
}

export function convertTCustomerToSendPayloadNested(payload: TCustomer) {
  return {
    id: payload.id,
    name: payload.name ?? '',
    location: payload.location ?? ''
  }
}

export function convertTProjectToSendPayload(payload: TProject) {
  return {
    uuid: payload.id ?? undefined,
    name: payload.name ?? '',
    public: Number(payload.show),
    position: payload.position ?? '',
    type: payload.type ?? '-1',
    customer: payload.customer ?? '',
    location: payload.location ?? '',
    content: payload.content ?? '',
    content_short: payload.content_short ?? '',
    content_long: payload.content_long ?? '',
    dates: payload.dates.map((entry) => convertTDatesToSendPayload(entry)),
    tech: payload.tech.map((entry) => convertTTechToSendPayload(entry)),
    customers: payload.customers.map((entry) => convertTCustomerToSendPayloadNested(entry))
  }
}
