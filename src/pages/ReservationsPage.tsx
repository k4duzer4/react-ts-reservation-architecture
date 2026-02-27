import { Button, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export function ReservationsPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Reservas</Typography>
      <Typography color="text.secondary">
        Tela inicial da listagem de reservas.
      </Typography>
      <Button variant="contained" component={RouterLink} to="/reservas/nova" sx={{ width: 'fit-content' }}>
        Criar nova reserva
      </Button>
    </Stack>
  )
}
