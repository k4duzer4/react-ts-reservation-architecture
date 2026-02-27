import { useState, type FormEvent } from 'react'
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

type LocationState = {
  from?: string
}

export function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const from = (location.state as LocationState | null)?.from ?? '/reservas'

  if (isAuthenticated) {
    return <Navigate to="/reservas" replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!username.trim() || !password.trim()) {
      setError('Informe usuário e senha para entrar.')
      return
    }

    setIsSubmitting(true)

    try {
      await login(username, password)
      navigate(from, { replace: true })
    } catch {
      setError('Não foi possível entrar no momento.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        backgroundColor: 'grey.100',
      }}
    >
      <Paper elevation={2} sx={{ p: 4, width: '100%', maxWidth: 420 }}>
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <Typography variant="h5">Entrar</Typography>
          <Typography variant="body2" color="text.secondary">
            Login fake para acessar as rotas protegidas.
          </Typography>

          {error ? <Alert severity="error">{error}</Alert> : null}

          <TextField
            label="Usuário"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            fullWidth
          />
          <TextField
            label="Senha"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            fullWidth
          />

          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}
