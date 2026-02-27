import { Paper, Skeleton, Stack } from '@mui/material'

type ReservationsTableSkeletonProps = {
  rows?: number
}

export function ReservationsTableSkeleton({ rows = 6 }: ReservationsTableSkeletonProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Skeleton variant="text" height={36} width="40%" />
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} variant="rounded" height={34} />
        ))}
      </Stack>
    </Paper>
  )
}
