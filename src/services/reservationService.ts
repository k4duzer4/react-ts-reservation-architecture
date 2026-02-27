import type { Reservation } from '@/models/reservation'
import { api } from '@/services/api'

export type CreateReservationInput = Omit<Reservation, 'id'>
export type UpdateReservationInput = Partial<Omit<Reservation, 'id'>>

const RESOURCE = '/reservations'

export const reservationService = {
  async list() {
    const { data } = await api.get<Reservation[]>(RESOURCE)
    return data
  },

  async getById(id: string) {
    const { data } = await api.get<Reservation>(`${RESOURCE}/${id}`)
    return data
  },

  async create(payload: CreateReservationInput) {
    const { data } = await api.post<Reservation>(RESOURCE, payload)
    return data
  },

  async update(id: string, payload: UpdateReservationInput) {
    const { data } = await api.patch<Reservation>(`${RESOURCE}/${id}`, payload)
    return data
  },

  async remove(id: string) {
    await api.delete(`${RESOURCE}/${id}`)
  },
}
