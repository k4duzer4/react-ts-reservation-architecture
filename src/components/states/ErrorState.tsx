import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import { Alert, Stack, Typography } from '@mui/material'
import { Button } from '@/components/ui'

type ErrorStateProps = {
  title?: string
  message?: string
  retryLabel?: string
  onRetry?: () => void
  minHeight?: number | string
}

export function ErrorState({
  title = 'Ocorreu um erro',
  message = 'Não foi possível carregar os dados. Tente novamente.',
  retryLabel = 'Tentar novamente',
  onRetry,
  minHeight = 220,
}: ErrorStateProps) {
  return (
    <Stack
      spacing={1.5}
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      sx={{ minHeight, px: 2 }}
      role="alert"
    >
      <ErrorOutlineOutlinedIcon color="error" sx={{ fontSize: 42 }} />
      <Typography variant="h6">{title}</Typography>
      <Alert severity="error" sx={{ width: '100%', maxWidth: 520 }}>
        {message}
      </Alert>
      {onRetry ? (
        <Button variant="contained" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </Stack>
  )
}
