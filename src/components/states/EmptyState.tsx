import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'
import { Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

type EmptyStateProps = {
  title?: string
  description?: string
  action?: ReactNode
  minHeight?: number | string
}

export function EmptyState({
  title = 'Nenhum registro encontrado',
  description = 'Ajuste os filtros ou crie um novo item para começar.',
  action,
  minHeight = 220,
}: EmptyStateProps) {
  return (
    <Stack
      spacing={1.5}
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      sx={{ minHeight, px: 2 }}
    >
      <InboxOutlinedIcon color="disabled" sx={{ fontSize: 42 }} />
      <Typography variant="h6">{title}</Typography>
      <Typography color="text.secondary">{description}</Typography>
      {action ?? null}
    </Stack>
  )
}
