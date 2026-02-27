import type { Reservation } from '@/models/reservation'
import type { ReservationFilterStrategy } from '@/utils/filters/types'

export function applyFilters(
  reservations: Reservation[],
  strategies: ReservationFilterStrategy[],
): Reservation[] {
  return strategies.reduce(
    (currentReservations, strategy) => currentReservations.filter(strategy),
    reservations,
  )
}
