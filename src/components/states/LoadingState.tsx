import { CircularProgress, Stack, Typography } from '@mui/material'

type LoadingStateProps = {
  message?: string
  minHeight?: number | string
}

export function LoadingState({ message = 'Carregando...', minHeight = 220 }: LoadingStateProps) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight }}
      role="status"
      aria-live="polite"
    >
      <CircularProgress />
      <Typography color="text.secondary">{message}</Typography>
    </Stack>
  )
}
