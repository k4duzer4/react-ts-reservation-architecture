import { useMemo, useState } from 'react'
import { Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { ReservationsTable } from '@/components/reservations'
import { EmptyState, ErrorState, LoadingState } from '@/components/states'
import { Button, Input, Select } from '@/components/ui'
import { useDebounce } from '@/hooks/useDebounce'
import type { ReservationStatus } from '@/models/reservation'
import { useReservations } from '@/hooks/useReservations'
import {
  applyFilters,
  filterByDate,
  filterByStatus,
  filterByText,
  type StatusFilterValue,
} from '@/utils/filters'
import { canTransition } from '@/utils/statusMachine'

const STATUS_OPTIONS = [
  { label: 'Todos', value: 'ALL' },
  { label: 'Pendente', value: 'PENDING' },
  { label: 'Confirmada', value: 'CONFIRMED' },
  { label: 'Cancelada', value: 'CANCELED' },
]

export function ReservationsPage() {
  const navigate = useNavigate()
  const { reservations, loading, error, reload, updateReservation } = useReservations()
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('ALL')
  const [dateFilter, setDateFilter] = useState('')
  const [textFilter, setTextFilter] = useState('')

  const debouncedTextFilter = useDebounce(textFilter, 400)

  const filteredReservations = useMemo(() => {
    return applyFilters(reservations, [
      filterByStatus(statusFilter),
      filterByDate(dateFilter),
      filterByText(debouncedTextFilter),
    ])
  }, [reservations, statusFilter, dateFilter, debouncedTextFilter])

  const handleEdit = (id: string) => {
    navigate(`/reservas/${id}/editar`)
  }

  const handleStatusTransition = async (id: string, nextStatus: ReservationStatus) => {
    const reservation = reservations.find((item) => item.id === id)

    if (!reservation || !canTransition(reservation.status, nextStatus)) {
      return
    }

    const shouldContinue = window.confirm(
      nextStatus === 'CONFIRMED'
        ? 'Deseja confirmar esta reserva?'
        : 'Deseja cancelar esta reserva?',
    )

    if (!shouldContinue) {
      return
    }

    try {
      await updateReservation(id, { status: nextStatus })
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

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
        <Select
          label="Status"
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={(value) => setStatusFilter(value as StatusFilterValue)}
        />
        <Input
          label="Data"
          type="date"
          value={dateFilter}
          onChange={(event) => setDateFilter(event.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Input
          label="Buscar"
          placeholder="Título, usuário ou status"
          value={textFilter}
          onChange={(event) => setTextFilter(event.target.value)}
        />
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

      {!loading && !error && reservations.length > 0 && filteredReservations.length === 0 ? (
        <EmptyState
          title="Nenhum resultado para os filtros"
          description="Ajuste os filtros e tente novamente."
        />
      ) : null}

      {!loading && !error && filteredReservations.length > 0 ? (
        <ReservationsTable
          reservations={filteredReservations}
          onEdit={handleEdit}
          onConfirm={(id) => {
            void handleStatusTransition(id, 'CONFIRMED')
          }}
          onCancel={(id) => {
            void handleStatusTransition(id, 'CANCELED')
          }}
        />
      ) : null}
    </Stack>
  )
}
