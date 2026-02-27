import type { Reservation } from '@/models/reservation'
import type { ReservationFilterStrategy } from '@/utils/filters/types'

export function filterByDate(date: string): ReservationFilterStrategy {
  return (reservation: Reservation) => {
    if (!date.trim()) {
      return true
    }

    return reservation.date === date
  }
}
