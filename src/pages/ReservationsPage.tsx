import { Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { ReservationsTable } from '@/components/reservations'
import { EmptyState, ErrorState, LoadingState } from '@/components/states'
import { Button } from '@/components/ui'
import { useReservations } from '@/hooks/useReservations'

export function ReservationsPage() {
  const navigate = useNavigate()
  const { reservations, loading, error, reload, deleteReservation } = useReservations()

  const handleEdit = (id: string) => {
    navigate(`/reservas/${id}/editar`)
  }

  const handleCancel = async (id: string) => {
    const shouldDelete = window.confirm('Deseja cancelar esta reserva?')

    if (!shouldDelete) {
      return
    }

    try {
      await deleteReservation(id)
    } catch {
      // erro já controlado no hook
    }
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Reservas</Typography>
      <Typography color="text.secondary">
        Tela inicial da listagem de reservas.
      </Typography>

      <Stack direction="row" spacing={1}>
        <Button variant="contained" onClick={() => navigate('/reservas/nova')}>
          Criar nova reserva
        </Button>
        <Button variant="outlined" onClick={() => void reload()}>
          Recarregar
        </Button>
      </Stack>

      {loading ? <LoadingState message="Carregando reservas..." /> : null}

      {!loading && error ? (
        <ErrorState
          title="Erro ao carregar reservas"
          message={error}
          onRetry={() => {
            void reload()
          }}
        />
      ) : null}

      {!loading && !error && reservations.length === 0 ? (
        <EmptyState
          title="Nenhuma reserva cadastrada"
          description="Crie uma nova reserva para começar."
          action={
            <Button variant="contained" onClick={() => navigate('/reservas/nova')}>
              Criar primeira reserva
            </Button>
          }
        />
      ) : null}

      {!loading && !error && reservations.length > 0 ? (
        <ReservationsTable
          reservations={reservations}
          onEdit={handleEdit}
          onCancel={(id) => {
            void handleCancel(id)
          }}
        />
      ) : null}
    </Stack>
  )
}
