export interface ICustomer {
  id?: string
  name?: string
  location?: string
}
export type TCustomer = Required<Omit<ICustomer, 'id'>> & {
  id?: string
}
export function convertICustomerToTCustomer(payload: ICustomer): TCustomer {
  return {
    id: payload.id,
    name: payload.name ?? '',
    location: payload.location ?? '',
  }
}
