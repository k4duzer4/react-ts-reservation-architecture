import type { Reservation, ReservationStatus } from '@/models/reservation'
import type { ReservationFilterStrategy } from '@/utils/filters/types'

export type StatusFilterValue = ReservationStatus | 'ALL'

export function filterByStatus(status: StatusFilterValue): ReservationFilterStrategy {
  return (reservation: Reservation) => {
    if (status === 'ALL') {
      return true
    }

    return reservation.status === status
  }
}
