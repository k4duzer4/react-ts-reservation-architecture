import { Paper, Stack, Typography, type AlertColor } from '@mui/material'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReservationForm } from '@/components/reservations'
import { ErrorState, LoadingState } from '@/components/states'
import { Button, Toast } from '@/components/ui'
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
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 1.5, md: 2 },
        borderRadius: 3,
        backgroundColor: 'background.paper',
        borderColor: 'transparent',
      }}
    >
      <Stack spacing={2.25}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={1.5}>
          <Stack spacing={0.25}>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              Nova Reserva
            </Typography>
            <Typography color="text.secondary">
              Preencha os dados para criar uma nova reserva.
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => navigate('/reservas')}
              sx={{ minHeight: 44, px: 2.5, fontWeight: 600 }}
            >
              Voltar
            </Button>
          </Stack>
        </Stack>

        <Paper
          variant="outlined"
          sx={{
            p: { xs: 1.25, md: 1.5 },
            borderRadius: 2,
            backgroundColor: 'background.default',
            borderColor: 'transparent',
          }}
        >
          <ReservationForm
            submitLabel="Criar reserva"
            existingReservations={reservations}
            onSubmit={handleCreateReservation}
            onCancel={() => navigate('/reservas')}
          />
        </Paper>

        <Toast
          open={Boolean(toast)}
          message={toast?.message ?? ''}
          severity={toast?.severity ?? 'success'}
          onClose={closeToast}
        />
      </Stack>
    </Paper>
  )
}
