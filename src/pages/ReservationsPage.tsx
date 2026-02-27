import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react'
import {
  Alert,
  Chip,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  TablePagination,
  Typography,
  type AlertColor,
} from '@mui/material'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import SortRoundedIcon from '@mui/icons-material/SortRounded'
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

const STATUS_OPTIONS: { label: string; value: StatusFilterValue }[] = [
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
  const [page, setPage] = useState(0)
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
    const startIndex = page * pageSize
    return sortedReservations.slice(startIndex, startIndex + pageSize)
  }, [sortedReservations, page, pageSize])

  const totalCount = sortedReservations.length

  useEffect(() => {
    setPage(0)
  }, [statusFilter, dateFilter, debouncedTextFilter, sortBy, pageSize])

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(totalCount / pageSize) - 1)

    if (page > maxPage) {
      setPage(maxPage)
    }
  }, [page, pageSize, totalCount])

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

  const handleChangePage = useCallback((_event: unknown, nextPage: number) => {
    setPage(nextPage)
  }, [])

  const handleChangeRowsPerPage = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setPageSize(parseInt(event.target.value, 10))
      setPage(0)
    },
    [],
  )

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
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 1.5, md: 2 },
        borderRadius: 3,
        backgroundColor: 'background.paper',
        borderColor: 'divider',
      }}
    >
      <Stack spacing={2.25}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={1.5}>
        <Stack spacing={0.25}>
          <Typography variant="h4" fontWeight={700} color="text.primary">
            Reservas
          </Typography>
          <Typography color="text.secondary">Gestão e acompanhamento das reservas ativas.</Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleReload}
            sx={{ minHeight: 44, px: 2.5, fontWeight: 600 }}
          >
            Recarregar
          </Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            sx={{ minHeight: 44, px: 2.5, fontWeight: 600 }}
          >
            Nova Reserva
          </Button>
        </Stack>
      </Stack>

      <Paper
        variant="outlined"
        sx={{
          p: 1.5,
          borderRadius: 2.5,
          backgroundColor: 'background.paper',
          borderColor: 'divider',
        }}
      >
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Chip
              icon={<FilterAltRoundedIcon />}
              label="Filtros"
              variant="outlined"
              sx={{ color: 'text.primary', borderColor: 'divider' }}
            />
            {STATUS_OPTIONS.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                clickable
                color={statusFilter === option.value ? 'primary' : 'default'}
                variant={statusFilter === option.value ? 'filled' : 'outlined'}
                onClick={() => setStatusFilter(option.value)}
                sx={
                  statusFilter === option.value
                    ? undefined
                    : { color: 'text.primary', borderColor: 'divider' }
                }
              />
            ))}
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
            <Input
              label="Buscar"
              placeholder="Buscar por título, usuário ou status"
              value={textFilter}
              onChange={(event) => setTextFilter(event.target.value)}
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'background.paper' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <Input
              label="Data"
              type="date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'background.paper' } }}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarMonthRoundedIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <Select
              label="Ordenação"
              options={SORT_OPTIONS}
              value={sortBy}
              onChange={(value) => setSortBy(value as SortValue)}
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'background.paper' } }}
              startAdornment={
                <InputAdornment position="start">
                  <SortRoundedIcon fontSize="small" color="action" />
                </InputAdornment>
              }
            />
          </Stack>
        </Stack>
      </Paper>

      {loading ? <ReservationsTableSkeleton rows={8} /> : null}

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
        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
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

          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={pageSize}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 20]}
            labelRowsPerPage="Rows per page:"
            sx={{
              borderTop: 1,
              borderColor: 'divider',
              color: 'text.primary',
              '& .MuiSelect-select': { color: 'text.primary' },
              '& .MuiTablePagination-displayedRows': { color: 'text.secondary' },
              '& .MuiTablePagination-actions button': { color: 'text.primary' },
            }}
          />
        </Paper>
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
    </Paper>
  )
}
