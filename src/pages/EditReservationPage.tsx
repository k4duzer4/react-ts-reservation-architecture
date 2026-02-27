import { Alert, Stack, Typography } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ReservationForm } from '@/components/reservations'
import { EmptyState, ErrorState, LoadingState } from '@/components/states'
import { useReservations } from '@/hooks/useReservations'
import type { Reservation } from '@/models/reservation'
import { reservationService } from '@/services/reservationService'

export function EditReservationPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [loadingReservation, setLoadingReservation] = useState(true)
  const [loadingError, setLoadingError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { updateReservation, reservations } = useReservations()

  const loadReservation = useCallback(async () => {
    if (!id) {
      setLoadingError('Reserva inválida.')
      setLoadingReservation(false)
      return
    }

    setLoadingReservation(true)
    setLoadingError(null)

    try {
      const response = await reservationService.getById(id)
      setReservation(response)
    } catch {
      setLoadingError('Não foi possível carregar os dados da reserva.')
    } finally {
      setLoadingReservation(false)
    }
  }, [id])

  useEffect(() => {
    void loadReservation()
  }, [loadReservation])

  const handleUpdateReservation = async (values: Omit<Reservation, 'id'>) => {
    if (!id) {
      return
    }

    setSubmitError(null)

    try {
      await updateReservation(id, values)
      navigate('/reservas')
    } catch {
      setSubmitError('Não foi possível atualizar a reserva. Tente novamente.')
    }
  }

  if (!id) {
    return <ErrorState title="Reserva inválida" message="ID da reserva não informado." />
  }

  if (loadingReservation) {
    return <LoadingState message="Carregando reserva..." />
  }

  if (loadingError) {
    return (
      <ErrorState
        title="Erro ao carregar reserva"
        message={loadingError}
        onRetry={() => {
          void loadReservation()
        }}
      />
    )
  }

  if (!reservation) {
    return (
      <EmptyState
        title="Reserva não encontrada"
        description="Não encontramos a reserva solicitada para edição."
      />
    )
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Editar Reserva</Typography>
      <Typography color="text.secondary">Atualize os dados da reserva selecionada.</Typography>

      {submitError ? <Alert severity="error">{submitError}</Alert> : null}

      <ReservationForm
        submitLabel="Salvar alterações"
        initialValues={reservation}
        existingReservations={reservations}
        currentReservationId={reservation.id}
        onSubmit={handleUpdateReservation}
        onCancel={() => navigate('/reservas')}
      />
    </Stack>
  )
}
