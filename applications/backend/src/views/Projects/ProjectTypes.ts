export type Dates = {
  start_date: string
  end_date: string
}
export type Tech = {
  id: string
  name: string
  type: string
  expertise_level: string
}
export type Customer = {
  id: string
  name: string
  location: string
}
export type ProjectType = {
  id?: string
  name: string
  position: string
  customer: string
  location: string
  content: string
  type: string
  customers: Customer[]
  dates: Dates[]
  tech: Tech[]
}
