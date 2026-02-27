import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { Alert, Pagination, Snackbar, Stack, Typography, type AlertColor } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { ReservationsTable, ReservationsTableSkeleton } from '@/components/reservations'
import { EmptyState, ErrorState } from '@/components/states'
import { Button, Input, Select, Toast } from '@/components/ui'
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

const SORT_OPTIONS = [
  { label: 'Data (mais recente)', value: 'DATE_DESC' },
  { label: 'Data (mais antiga)', value: 'DATE_ASC' },
  { label: 'Título (A-Z)', value: 'TITLE_ASC' },
  { label: 'Título (Z-A)', value: 'TITLE_DESC' },
]

const PAGE_SIZE_OPTIONS = [
  { label: '5 por página', value: '5' },
  { label: '10 por página', value: '10' },
  { label: '20 por página', value: '20' },
]

type SortValue = 'DATE_DESC' | 'DATE_ASC' | 'TITLE_ASC' | 'TITLE_DESC'

type ToastState = {
  message: string
  severity: AlertColor
}

type PendingTransitionState = {
  id: string
  nextStatus: ReservationStatus
}

type LocationState = {
  toast?: ToastState
}

export function ReservationsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { reservations, loading, error, reload, updateReservation } = useReservations()
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('ALL')
  const [dateFilter, setDateFilter] = useState('')
  const [textFilter, setTextFilter] = useState('')
  const [sortBy, setSortBy] = useState<SortValue>('DATE_DESC')
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [toast, setToast] = useState<ToastState | null>(null)
  const [pendingTransition, setPendingTransition] = useState<PendingTransitionState | null>(null)

  const debouncedTextFilter = useDebounce(textFilter, 400)

  const filteredReservations = useMemo(() => {
    return applyFilters(reservations, [
      filterByStatus(statusFilter),
      filterByDate(dateFilter),
      filterByText(debouncedTextFilter),
    ])
  }, [reservations, statusFilter, dateFilter, debouncedTextFilter])

  const sortedReservations = useMemo(() => {
    const sorted = [...filteredReservations]

    sorted.sort((left, right) => {
      if (sortBy === 'DATE_ASC') {
        return `${left.date} ${left.startTime}`.localeCompare(`${right.date} ${right.startTime}`)
      }

      if (sortBy === 'DATE_DESC') {
        return `${right.date} ${right.startTime}`.localeCompare(`${left.date} ${left.startTime}`)
      }

      if (sortBy === 'TITLE_ASC') {
        return left.title.localeCompare(right.title)
      }

      return right.title.localeCompare(left.title)
    })

    return sorted
  }, [filteredReservations, sortBy])

  const paginatedReservations = useMemo(() => {
    const startIndex = (page - 1) * pageSize
    return sortedReservations.slice(startIndex, startIndex + pageSize)
  }, [sortedReservations, page, pageSize])

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(sortedReservations.length / pageSize))
  }, [sortedReservations.length, pageSize])

  useEffect(() => {
    setPage(1)
  }, [statusFilter, dateFilter, debouncedTextFilter, sortBy, pageSize])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  useEffect(() => {
    const state = location.state as LocationState | null

    if (!state?.toast) {
      return
    }

    setToast(state.toast)
    navigate(location.pathname, { replace: true })
  }, [location.pathname, location.state, navigate])

  const handleEdit = useCallback(
    (id: string) => {
      navigate(`/reservas/${id}/editar`)
    },
    [navigate],
  )

  const handleCreate = useCallback(() => {
    navigate('/reservas/nova')
  }, [navigate])

  const handleReload = useCallback(() => {
    void reload()
  }, [reload])

  const handleChangePage = useCallback((_event: ChangeEvent<unknown>, nextPage: number) => {
    setPage(nextPage)
  }, [])

  const handleChangePageSize = useCallback((value: string) => {
    setPageSize(Number(value))
  }, [])

  const requestStatusTransition = useCallback(
    (id: string, nextStatus: ReservationStatus) => {
      const reservation = reservations.find((item) => item.id === id)

      if (!reservation || !canTransition(reservation.status, nextStatus)) {
        setToast({ message: 'Transição de status inválida.', severity: 'error' })
        return
      }

      setPendingTransition({ id, nextStatus })
    },
    [reservations],
  )

  const confirmStatusTransition = useCallback(async () => {
    if (!pendingTransition) {
      return
    }

    const { id, nextStatus } = pendingTransition
    const reservation = reservations.find((item) => item.id === id)

    if (!reservation || !canTransition(reservation.status, nextStatus)) {
      setToast({ message: 'Transição de status inválida.', severity: 'error' })
      setPendingTransition(null)
      return
    }

    setPendingTransition(null)

    try {
      await updateReservation(id, { status: nextStatus })
      setToast({
        message:
          nextStatus === 'CONFIRMED'
            ? 'Reserva confirmada com sucesso.'
            : 'Reserva cancelada com sucesso.',
        severity: 'success',
      })
    } catch {
      setToast({ message: 'Não foi possível atualizar o status da reserva.', severity: 'error' })
    }
  }, [pendingTransition, reservations, updateReservation])

  const cancelStatusTransition = useCallback(() => {
    setPendingTransition(null)
  }, [])

  const closeToast = useCallback(() => {
    setToast(null)
  }, [])

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Reservas</Typography>
      <Typography color="text.secondary">Tela inicial da listagem de reservas.</Typography>

      <Stack direction="row" spacing={1}>
        <Button variant="contained" onClick={handleCreate}>
          Criar nova reserva
        </Button>
        <Button variant="outlined" onClick={handleReload}>
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
        <Select
          label="Ordenação"
          options={SORT_OPTIONS}
          value={sortBy}
          onChange={(value) => setSortBy(value as SortValue)}
        />
        <Select
          label="Itens por página"
          options={PAGE_SIZE_OPTIONS}
          value={String(pageSize)}
          onChange={handleChangePageSize}
        />
      </Stack>

      {loading ? <ReservationsTableSkeleton /> : null}

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
            <Button variant="contained" onClick={handleCreate}>
              Criar primeira reserva
            </Button>
          }
        />
      ) : null}

      {!loading && !error && reservations.length > 0 && sortedReservations.length === 0 ? (
        <EmptyState
          title="Nenhum resultado para os filtros"
          description="Ajuste os filtros e tente novamente."
        />
      ) : null}

      {!loading && !error && paginatedReservations.length > 0 ? (
        <Stack spacing={2}>
          <ReservationsTable
            reservations={paginatedReservations}
            onEdit={handleEdit}
            onConfirm={(id) => {
              requestStatusTransition(id, 'CONFIRMED')
            }}
            onCancel={(id) => {
              requestStatusTransition(id, 'CANCELED')
            }}
          />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" color="text.secondary">
              Exibindo {paginatedReservations.length} de {sortedReservations.length} reservas
            </Typography>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChangePage}
              color="primary"
              shape="rounded"
            />
          </Stack>
        </Stack>
      ) : null}

      <Toast
        open={Boolean(toast)}
        message={toast?.message ?? ''}
        severity={toast?.severity ?? 'success'}
        onClose={closeToast}
      />

      <Snackbar
        open={Boolean(pendingTransition)}
        onClose={cancelStatusTransition}
        autoHideDuration={8000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="info"
          variant="filled"
          action={
            <Stack direction="row" spacing={1}>
              <Button size="small" color="inherit" onClick={cancelStatusTransition}>
                Cancelar
              </Button>
              <Button size="small" color="inherit" onClick={() => void confirmStatusTransition()}>
                Confirmar
              </Button>
            </Stack>
          }
        >
          {pendingTransition?.nextStatus === 'CONFIRMED'
            ? 'Deseja confirmar esta reserva?'
            : 'Deseja cancelar esta reserva?'}
        </Alert>
      </Snackbar>
    </Stack>
  )
}
