import type { ReservationStatus } from '@/models/reservation'

const transitionMap: Record<ReservationStatus, ReservationStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELED'],
  CONFIRMED: ['CANCELED'],
  CANCELED: [],
}

export function canTransition(from: ReservationStatus, to: ReservationStatus): boolean {
  if (from === to) {
    return true
  }

  return transitionMap[from].includes(to)
}

export function getAllowedTransitions(from: ReservationStatus): ReservationStatus[] {
  return [from, ...transitionMap[from]]
}
