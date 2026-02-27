import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material'
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h6" component="h1">
              Painel de Reservas
            </Typography>
            <Button color="inherit" component={RouterLink} to="/reservas">
              Reservas
            </Button>
            <Button color="inherit" component={RouterLink} to="/reservas/nova">
              Nova reserva
            </Button>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2">{user?.name}</Typography>
            <Button color="inherit" onClick={handleLogout}>
              Sair
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  )
}
