import type { ReservationStatus } from '@/models/reservation'

export interface ReservationDTO {
  id: string
  title: string
  user: string
  date: string
  start_time: string
  end_time: string
  status: ReservationStatus
}

export type CreateReservationDTO = Omit<ReservationDTO, 'id'>
export type UpdateReservationDTO = Partial<CreateReservationDTO>
