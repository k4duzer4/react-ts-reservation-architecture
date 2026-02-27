import type { Reservation } from '@/models/reservation'
import type { ReservationDTO } from '@/models/reservationDTO'
import { fromDTO, toCreateDTO, toUpdateDTO } from '@/adapters'
import { api } from '@/services/api'

export type CreateReservationInput = Omit<Reservation, 'id'>
export type UpdateReservationInput = Partial<Omit<Reservation, 'id'>>

const RESOURCE = '/reservations'

export const reservationService = {
  async list() {
    const { data } = await api.get<ReservationDTO[]>(RESOURCE)
    return data.map(fromDTO)
  },

  async getById(id: string) {
    const { data } = await api.get<ReservationDTO>(`${RESOURCE}/${id}`)
    return fromDTO(data)
  },

  async create(payload: CreateReservationInput) {
    const { data } = await api.post<ReservationDTO>(RESOURCE, toCreateDTO(payload))
    return fromDTO(data)
  },

  async update(id: string, payload: UpdateReservationInput) {
    const { data } = await api.patch<ReservationDTO>(`${RESOURCE}/${id}`, toUpdateDTO(payload))
    return fromDTO(data)
  },

  async remove(id: string) {
    await api.delete(`${RESOURCE}/${id}`)
  },
}
