export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELED'

export interface Reservation {
  id: string
  title: string
  user: string
  date: string
  startTime: string
  endTime: string
  status: ReservationStatus
}
