import type { Reservation } from '@/models/reservation'
import type { ReservationDTO } from '@/models/reservationDTO'
import { fromDTO, toCreateDTO, toUpdateDTO } from '@/adapters'
import { api } from '@/services/api'
import axios from 'axios'

export type CreateReservationInput = Omit<Reservation, 'id'>
export type UpdateReservationInput = Partial<Omit<Reservation, 'id'>>

const RESOURCE = '/reservations'
const LOCAL_STORAGE_KEY = 'reservations-local-cache-v1'

function isConnectionError(error: unknown) {
  return axios.isAxiosError(error) && !error.response
}

function readLocalReservations(): ReservationDTO[] {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (!stored) {
    return []
  }

  try {
    return JSON.parse(stored) as ReservationDTO[]
  } catch {
    return []
  }
}

function writeLocalReservations(reservations: ReservationDTO[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reservations))
}

async function fetchSeedReservations() {
  const response = await fetch('/db.json', { cache: 'no-store' })
  if (!response.ok) {
    return [] as ReservationDTO[]
  }

  const payload = (await response.json()) as { reservations?: ReservationDTO[] }
  return payload.reservations ?? []
}

async function getLocalReservations() {
  const current = readLocalReservations()
  if (current.length > 0) {
    return current
  }

  const seeded = await fetchSeedReservations()
  writeLocalReservations(seeded)
  return seeded
}

function generateId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return String(Date.now())
}

export const reservationService = {
  async list() {
    try {
      const { data } = await api.get<ReservationDTO[]>(RESOURCE)
      writeLocalReservations(data)
      return data.map(fromDTO)
    } catch (error) {
      if (!isConnectionError(error)) {
        throw error
      }

      const localData = await getLocalReservations()
      return localData.map(fromDTO)
    }
  },

  async getById(id: string) {
    try {
      const { data } = await api.get<ReservationDTO>(`${RESOURCE}/${id}`)
      return fromDTO(data)
    } catch (error) {
      if (!isConnectionError(error)) {
        throw error
      }

      const localData = await getLocalReservations()
      const reservation = localData.find((item) => item.id === id)

      if (!reservation) {
        throw new Error('Reserva não encontrada')
      }

      return fromDTO(reservation)
    }
  },

  async create(payload: CreateReservationInput) {
    try {
      const { data } = await api.post<ReservationDTO>(RESOURCE, toCreateDTO(payload))
      return fromDTO(data)
    } catch (error) {
      if (!isConnectionError(error)) {
        throw error
      }

      const localData = await getLocalReservations()
      const created: ReservationDTO = {
        id: generateId(),
        ...toCreateDTO(payload),
      }

      const updated = [created, ...localData]
      writeLocalReservations(updated)
      return fromDTO(created)
    }
  },

  async update(id: string, payload: UpdateReservationInput) {
    try {
      const { data } = await api.patch<ReservationDTO>(`${RESOURCE}/${id}`, toUpdateDTO(payload))
      return fromDTO(data)
    } catch (error) {
      if (!isConnectionError(error)) {
        throw error
      }

      const localData = await getLocalReservations()
      const index = localData.findIndex((item) => item.id === id)

      if (index < 0) {
        throw new Error('Reserva não encontrada')
      }

      const updatedReservation: ReservationDTO = {
        ...localData[index],
        ...toUpdateDTO(payload),
      }

      const updated = [...localData]
      updated[index] = updatedReservation
      writeLocalReservations(updated)
      return fromDTO(updatedReservation)
    }
  },

  async remove(id: string) {
    try {
      await api.delete(`${RESOURCE}/${id}`)
    } catch (error) {
      if (!isConnectionError(error)) {
        throw error
      }

      const localData = await getLocalReservations()
      const updated = localData.filter((item) => item.id !== id)
      writeLocalReservations(updated)
    }
  },
}
