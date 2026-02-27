import { memo } from 'react'
import {
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import type { Reservation, ReservationStatus } from '@/models/reservation'
import { canTransition } from '@/utils/statusMachine'

type ReservationsTableProps = {
  reservations: Reservation[]
  onEdit?: (id: string) => void
  onConfirm?: (id: string) => void
  onComplete?: (id: string) => void
  onCancel?: (id: string) => void
  onDelete?: (id: string) => void
  emptyMessage?: string
}

const statusLabelMap: Record<ReservationStatus, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmada',
  COMPLETED: 'Concluída',
  CANCELED: 'Cancelada',
}

const statusColorMap: Record<ReservationStatus, 'default' | 'warning' | 'success' | 'error' | 'info'> = {
  PENDING: 'warning',
  CONFIRMED: 'success',
  COMPLETED: 'info',
  CANCELED: 'error',
}

function ReservationsTableComponent({
  reservations,
  onEdit,
  onConfirm,
  onComplete,
  onCancel,
  onDelete,
  emptyMessage = 'Nenhuma reserva encontrada.',
}: ReservationsTableProps) {
  if (reservations.length === 0) {
    return <Typography color="text.secondary">{emptyMessage}</Typography>
  }

  return (
    <TableContainer sx={{ borderRadius: 2.5, overflow: 'hidden' }}>
      <Table size="medium">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, py: 1.75, color: 'text.primary', borderColor: 'divider' }}>
              Título
            </TableCell>
            <TableCell sx={{ fontWeight: 700, py: 1.75, color: 'text.primary', borderColor: 'divider' }}>
              Usuário
            </TableCell>
            <TableCell sx={{ fontWeight: 700, py: 1.75, color: 'text.primary', borderColor: 'divider' }}>
              Data
            </TableCell>
            <TableCell sx={{ fontWeight: 700, py: 1.75, color: 'text.primary', borderColor: 'divider' }}>
              Horário
            </TableCell>
            <TableCell sx={{ fontWeight: 700, py: 1.75, color: 'text.primary', borderColor: 'divider' }}>
              Status
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, py: 1.75, color: 'text.primary', borderColor: 'divider' }}>
              Ações
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {reservations.map((reservation) => (
            <TableRow
              key={reservation.id}
              hover
              sx={{
                '& td': {
                  py: 1.4,
                  borderColor: 'divider',
                  color: 'text.primary',
                  backgroundColor: 'transparent',
                },
                '&:hover td': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <TableCell>
                <Typography variant="body2" fontWeight={600} color="text.primary">
                  {reservation.title}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{reservation.user}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{reservation.date}</Typography>
              </TableCell>
              <TableCell>
                {reservation.startTime} - {reservation.endTime}
              </TableCell>
              <TableCell>
                <Chip
                  label={statusLabelMap[reservation.status]}
                  color={statusColorMap[reservation.status]}
                  size="small"
                  variant="filled"
                />
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Editar">
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => onEdit?.(reservation.id)}
                      sx={{
                        mr: 0.5,
                        border: 1,
                        borderColor: 'divider',
                        color: 'text.primary',
                      }}
                    >
                      <EditRoundedIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>

                <Tooltip title="Confirmar">
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => onConfirm?.(reservation.id)}
                      disabled={!canTransition(reservation.status, 'CONFIRMED')}
                      sx={{
                        mr: 0.5,
                        border: 1,
                        borderColor: 'divider',
                        color: 'success.main',
                      }}
                    >
                      <CheckRoundedIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>

                <Tooltip title="Cancelar">
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => onCancel?.(reservation.id)}
                      disabled={!canTransition(reservation.status, 'CANCELED')}
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        color: 'error.main',
                      }}
                    >
                      <CloseRoundedIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>

                <Tooltip title="Concluir">
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => onComplete?.(reservation.id)}
                      disabled={!canTransition(reservation.status, 'COMPLETED')}
                      sx={{
                        ml: 0.5,
                        mr: 0.5,
                        border: 1,
                        borderColor: 'divider',
                        color: 'info.main',
                      }}
                    >
                      <DoneAllRoundedIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>

                <Tooltip title="Excluir">
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => onDelete?.(reservation.id)}
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        color: 'text.secondary',
                      }}
                    >
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export const ReservationsTable = memo(ReservationsTableComponent)
