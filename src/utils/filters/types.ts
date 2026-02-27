import type { Reservation } from '@/models/reservation'

export type ReservationFilterStrategy = (reservation: Reservation) => boolean
