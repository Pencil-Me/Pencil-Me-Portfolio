export interface ICustomer {
  uuid: string
  name?: string
  location?: string
}
export type TCustomer = Required<Omit<ICustomer, 'uuid'>> & {
  id?: string
}
export function convertICustomerToTCustomer(payload: ICustomer): TCustomer {
  return {
    id: payload.uuid,
    name: payload.name ?? '',
    location: payload.location ?? '',
  }
}
