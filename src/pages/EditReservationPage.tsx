import { Stack, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'

export function EditReservationPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Editar Reserva</Typography>
      <Typography color="text.secondary">Editando reserva ID: {id}</Typography>
    </Stack>
  )
}
