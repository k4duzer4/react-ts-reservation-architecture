import { useCallback, useEffect, useState } from 'react'
import type { Reservation } from '@/models/reservation'
import {
  reservationService,
  type CreateReservationInput,
  type UpdateReservationInput,
} from '@/services/reservationService'

type UseReservationsResult = {
  reservations: Reservation[]
  loading: boolean
  error: string | null
  reload: () => Promise<void>
  createReservation: (payload: CreateReservationInput) => Promise<Reservation>
  updateReservation: (id: string, payload: UpdateReservationInput) => Promise<Reservation>
  deleteReservation: (id: string) => Promise<void>
}

export function useReservations(): UseReservationsResult {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await reservationService.list()
      setReservations(data)
    } catch {
      setError('Não foi possível carregar as reservas.')
    } finally {
      setLoading(false)
    }
  }, [])

  const createReservation = useCallback(async (payload: CreateReservationInput) => {
    setError(null)

    try {
      const createdReservation = await reservationService.create(payload)
      setReservations((current) => [createdReservation, ...current])
      return createdReservation
    } catch {
      setError('Não foi possível criar a reserva.')
      throw new Error('Falha ao criar reserva')
    }
  }, [])

  const updateReservation = useCallback(async (id: string, payload: UpdateReservationInput) => {
    setError(null)

    try {
      const updatedReservation = await reservationService.update(id, payload)
      setReservations((current) =>
        current.map((reservation) => (reservation.id === id ? updatedReservation : reservation)),
      )
      return updatedReservation
    } catch {
      setError('Não foi possível atualizar a reserva.')
      throw new Error('Falha ao atualizar reserva')
    }
  }, [])

  const deleteReservation = useCallback(async (id: string) => {
    setError(null)

    try {
      await reservationService.remove(id)
      setReservations((current) => current.filter((reservation) => reservation.id !== id))
    } catch {
      setError('Não foi possível excluir a reserva.')
      throw new Error('Falha ao excluir reserva')
    }
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  return {
    reservations,
    loading,
    error,
    reload,
    createReservation,
    updateReservation,
    deleteReservation,
  }
}
