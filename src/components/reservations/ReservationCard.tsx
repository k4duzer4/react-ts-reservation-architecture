import { Chip, Stack, Typography } from '@mui/material'
import { Button, Card } from '@/components/ui'
import type { Reservation, ReservationStatus } from '@/models/reservation'
import { canTransition } from '@/utils/statusMachine'

type ReservationCardProps = {
  reservation: Reservation
  onEdit?: (id: string) => void
  onConfirm?: (id: string) => void
  onCancel?: (id: string) => void
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

export function ReservationCard({ reservation, onEdit, onConfirm, onCancel }: ReservationCardProps) {
  return (
    <Card
      title={reservation.title}
      subtitle={`Usuário: ${reservation.user}`}
      actions={
        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={() => onEdit?.(reservation.id)}>
            Editar
          </Button>
          <Button
            size="small"
            color="success"
            onClick={() => onConfirm?.(reservation.id)}
            disabled={!canTransition(reservation.status, 'CONFIRMED')}
          >
            Confirmar
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => onCancel?.(reservation.id)}
            disabled={!canTransition(reservation.status, 'CANCELED')}
          >
            Cancelar
          </Button>
        </Stack>
      }
    >
      <Stack spacing={1}>
        <Typography variant="body2" color="text.secondary">
          Data: {reservation.date}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Horário: {reservation.startTime} - {reservation.endTime}
        </Typography>
        <Chip
          label={statusLabelMap[reservation.status]}
          color={statusColorMap[reservation.status]}
          size="small"
          sx={{ width: 'fit-content' }}
        />
      </Stack>
    </Card>
  )
}
