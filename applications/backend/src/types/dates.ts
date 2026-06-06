export interface IDates {
  start_date?: string | null
  end_date?: string | null
}

export type TDates = Required<IDates>

export function convertIDatesToTDates(payload: IDates): TDates {
  return {
    start_date: payload.start_date ?? null,
    end_date: payload.end_date ?? null
  }
}
