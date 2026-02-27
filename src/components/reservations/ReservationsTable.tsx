import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Button } from '@/components/ui'
import type { Reservation, ReservationStatus } from '@/models/reservation'

type ReservationsTableProps = {
  reservations: Reservation[]
  onEdit?: (id: string) => void
  onCancel?: (id: string) => void
  emptyMessage?: string
}

const statusLabelMap: Record<ReservationStatus, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmada',
  CANCELED: 'Cancelada',
}

const statusColorMap: Record<ReservationStatus, 'default' | 'warning' | 'success' | 'error'> = {
  PENDING: 'warning',
  CONFIRMED: 'success',
  CANCELED: 'error',
}

export function ReservationsTable({
  reservations,
  onEdit,
  onCancel,
  emptyMessage = 'Nenhuma reserva encontrada.',
}: ReservationsTableProps) {
  if (reservations.length === 0) {
    return <Typography color="text.secondary">{emptyMessage}</Typography>
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Título</TableCell>
            <TableCell>Usuário</TableCell>
            <TableCell>Data</TableCell>
            <TableCell>Horário</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {reservations.map((reservation) => (
            <TableRow key={reservation.id} hover>
              <TableCell>{reservation.title}</TableCell>
              <TableCell>{reservation.user}</TableCell>
              <TableCell>{reservation.date}</TableCell>
              <TableCell>
                {reservation.startTime} - {reservation.endTime}
              </TableCell>
              <TableCell>
                <Chip
                  label={statusLabelMap[reservation.status]}
                  color={statusColorMap[reservation.status]}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <Button size="small" onClick={() => onEdit?.(reservation.id)}>
                  Editar
                </Button>
                <Button size="small" color="error" onClick={() => onCancel?.(reservation.id)}>
                  Cancelar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
