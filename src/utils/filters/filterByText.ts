import type { Reservation } from '@/models/reservation'
import type { ReservationFilterStrategy } from '@/utils/filters/types'

export function filterByText(text: string): ReservationFilterStrategy {
  const normalizedQuery = text.trim().toLowerCase()

  return (reservation: Reservation) => {
    if (!normalizedQuery) {
      return true
    }

    const searchableContent = [reservation.title, reservation.user, reservation.status].join(' ').toLowerCase()
    return searchableContent.includes(normalizedQuery)
  }
}
