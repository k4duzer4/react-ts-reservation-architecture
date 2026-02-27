import {
  Card as MuiCard,
  CardActions,
  CardContent,
  Stack,
  Typography,
  type CardProps as MuiCardProps,
} from '@mui/material'
import type { ReactNode } from 'react'

export interface CardProps extends Omit<MuiCardProps, 'title'> {
  title?: ReactNode
  subtitle?: ReactNode
  actions?: ReactNode
  children: ReactNode
}

export function Card({ title, subtitle, actions, children, ...props }: CardProps) {
  return (
    <MuiCard {...props}>
      <CardContent>
        {title || subtitle ? (
          <Stack spacing={0.5} sx={{ mb: 2 }}>
            {title ? <Typography variant="h6">{title}</Typography> : null}
            {subtitle ? (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            ) : null}
          </Stack>
        ) : null}

        {children}
      </CardContent>

      {actions ? <CardActions>{actions}</CardActions> : null}
    </MuiCard>
  )
}
