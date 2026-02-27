import { useState, type FormEvent } from 'react'
import { Alert, Box, Paper, Stack, Typography } from '@mui/material'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Button, Input } from '@/components/ui'
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        backgroundColor: 'background.default',
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 1.5, md: 2 },
          borderRadius: 3,
          width: '100%',
          maxWidth: 720,
          backgroundColor: 'background.paper',
        }}
      >
        <Stack spacing={2.25}>
          <Stack spacing={0.25}>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              Entrar
            </Typography>
            <Typography color="text.secondary">
              Acesse o painel de reservas com seu usuário e senha.
            </Typography>
          </Stack>

          <Paper variant="outlined" sx={{ p: { xs: 1.25, md: 1.5 }, borderRadius: 2 }}>
            <Stack component="form" spacing={2} onSubmit={handleSubmit}>
              {error ? <Alert severity="error">{error}</Alert> : null}

              <Input
                label="Usuário"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                size="small"
              />
              <Input
                label="Senha"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                size="small"
              />

              <Stack direction="row" spacing={1}>
                <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ minHeight: 42, px: 2.25, fontWeight: 600 }}>
                  {isSubmitting ? 'Entrando...' : 'Entrar'}
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Paper>
    </Box>
  )
}
