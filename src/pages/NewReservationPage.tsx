import { Alert, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReservationForm } from '@/components/reservations'
import { ErrorState, LoadingState } from '@/components/states'
import type { Reservation } from '@/models/reservation'
import { useReservations } from '@/hooks/useReservations'

export function NewReservationPage() {
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { createReservation, reservations, loading, error, reload } = useReservations()

  const handleCreateReservation = async (values: Omit<Reservation, 'id'>) => {
    setSubmitError(null)

    try {
      await createReservation(values)
      navigate('/reservas')
    } catch {
      setSubmitError('Não foi possível criar a reserva. Tente novamente.')
    }
  }

  if (loading) {
    return <LoadingState message="Carregando dados do formulário..." />
  }

  if (error && reservations.length === 0) {
    return (
      <ErrorState
        title="Erro ao carregar reservas"
        message={error}
        onRetry={() => {
          void reload()
        }}
      />
    )
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Nova Reserva</Typography>
      <Typography color="text.secondary">Preencha os dados para criar uma nova reserva.</Typography>

      {submitError ? <Alert severity="error">{submitError}</Alert> : null}

      <ReservationForm
        submitLabel="Criar reserva"
        existingReservations={reservations}
        onSubmit={handleCreateReservation}
        onCancel={() => navigate('/reservas')}
      />
    </Stack>
  )
}
