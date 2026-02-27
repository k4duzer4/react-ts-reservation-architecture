import type { Reservation } from '@/models/reservation'
import type { CreateReservationDTO, ReservationDTO, UpdateReservationDTO } from '@/models/reservationDTO'

export function fromDTO(dto: ReservationDTO): Reservation {
  return {
    id: dto.id,
    title: dto.title,
    user: dto.user,
    date: dto.date,
    startTime: dto.start_time,
    endTime: dto.end_time,
    status: dto.status,
  }
}

export function toDTO(reservation: Reservation): ReservationDTO {
  return {
    id: reservation.id,
    title: reservation.title,
    user: reservation.user,
    date: reservation.date,
    start_time: reservation.startTime,
    end_time: reservation.endTime,
    status: reservation.status,
  }
}

export function toCreateDTO(reservation: Omit<Reservation, 'id'>): CreateReservationDTO {
  return {
    title: reservation.title,
    user: reservation.user,
    date: reservation.date,
    start_time: reservation.startTime,
    end_time: reservation.endTime,
    status: reservation.status,
  }
}

export function toUpdateDTO(reservation: Partial<Omit<Reservation, 'id'>>): UpdateReservationDTO {
  return {
    title: reservation.title,
    user: reservation.user,
    date: reservation.date,
    start_time: reservation.startTime,
    end_time: reservation.endTime,
    status: reservation.status,
  }
}
