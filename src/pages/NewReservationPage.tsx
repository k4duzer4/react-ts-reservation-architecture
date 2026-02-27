import { Stack, Typography, type AlertColor } from '@mui/material'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReservationForm } from '@/components/reservations'
import { ErrorState, LoadingState } from '@/components/states'
import { Toast } from '@/components/ui'
import type { Reservation } from '@/models/reservation'
import { useReservations } from '@/hooks/useReservations'

type ToastState = {
  message: string
  severity: AlertColor
}

export function NewReservationPage() {
  const navigate = useNavigate()
  const [toast, setToast] = useState<ToastState | null>(null)
  const { createReservation, reservations, loading, error, reload } = useReservations()

  const handleCreateReservation = useCallback(async (values: Omit<Reservation, 'id'>) => {
    setToast(null)

    try {
      await createReservation(values)
      navigate('/reservas', {
        state: {
          toast: {
            message: 'Reserva criada com sucesso.',
            severity: 'success',
          },
        },
      })
    } catch {
      setToast({ message: 'Não foi possível criar a reserva. Tente novamente.', severity: 'error' })
    }
  }, [createReservation, navigate])

  const closeToast = useCallback(() => {
    setToast(null)
  }, [])

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

      <ReservationForm
        submitLabel="Criar reserva"
        existingReservations={reservations}
        onSubmit={handleCreateReservation}
        onCancel={() => navigate('/reservas')}
      />

      <Toast
        open={Boolean(toast)}
        message={toast?.message ?? ''}
        severity={toast?.severity ?? 'success'}
        onClose={closeToast}
      />
    </Stack>
  )
}
