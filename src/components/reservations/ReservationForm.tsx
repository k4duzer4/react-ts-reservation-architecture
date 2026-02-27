import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Box, Stack, Typography } from '@mui/material'
import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button, Input, Select } from '@/components/ui'
import type { Reservation, ReservationStatus } from '@/models/reservation'
import { canTransition, getAllowedTransitions } from '@/utils/statusMachine'

const reservationSchema = z
  .object({
    title: z.string().trim().min(1, 'Título é obrigatório.'),
    user: z.string().trim().min(1, 'Usuário é obrigatório.'),
    date: z.string().trim().min(1, 'Data é obrigatória.'),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Horário inicial inválido.'),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Horário final inválido.'),
    status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED']),
  })
  .superRefine((values, context) => {
    const startMinutes = timeToMinutes(values.startTime)
    const endMinutes = timeToMinutes(values.endTime)

    if (endMinutes <= startMinutes) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endTime'],
        message: 'Horário final deve ser maior que o inicial.',
      })
    }
  })

type ReservationFormValues = z.infer<typeof reservationSchema>

const STATUS_OPTIONS: { label: string; value: ReservationStatus }[] = [
  { label: 'Pendente', value: 'PENDING' },
  { label: 'Confirmada', value: 'CONFIRMED' },
  { label: 'Concluída', value: 'COMPLETED' },
  { label: 'Cancelada', value: 'CANCELED' },
]

type ReservationFormProps = {
  initialValues?: Partial<Omit<Reservation, 'id'>>
  existingReservations?: Reservation[]
  currentReservationId?: string
  submitLabel: string
  onSubmit: (values: Omit<Reservation, 'id'>) => Promise<void> | void
  onCancel?: () => void
  cancelLabel?: string
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

function hasTimeConflict(
  candidate: Omit<Reservation, 'id'>,
  existingReservations: Reservation[],
  currentReservationId?: string,
): boolean {
  if (candidate.status === 'CANCELED') {
    return false
  }

  const candidateStart = timeToMinutes(candidate.startTime)
  const candidateEnd = timeToMinutes(candidate.endTime)

  return existingReservations.some((reservation) => {
    if (reservation.id === currentReservationId) {
      return false
    }

    if (reservation.status === 'CANCELED' || reservation.status === 'COMPLETED') {
      return false
    }

    if (reservation.date !== candidate.date) {
      return false
    }

    const existingStart = timeToMinutes(reservation.startTime)
    const existingEnd = timeToMinutes(reservation.endTime)

    return candidateStart < existingEnd && candidateEnd > existingStart
  })
}

function getDefaultValues(initialValues?: Partial<Omit<Reservation, 'id'>>): ReservationFormValues {
  return {
    title: initialValues?.title ?? '',
    user: initialValues?.user ?? '',
    date: initialValues?.date ?? '',
    startTime: initialValues?.startTime ?? '',
    endTime: initialValues?.endTime ?? '',
    status: initialValues?.status ?? 'PENDING',
  }
}

export function ReservationForm({
  initialValues,
  existingReservations = [],
  currentReservationId,
  submitLabel,
  onSubmit,
  onCancel,
  cancelLabel = 'Cancelar',
}: ReservationFormProps) {
  const allowedTransitions = useMemo(() => {
    if (!initialValues?.status) {
      return ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED'] as ReservationStatus[]
    }

    return getAllowedTransitions(initialValues.status)
  }, [initialValues?.status])

  const statusOptions = useMemo(
    () => STATUS_OPTIONS.filter((option) => allowedTransitions.includes(option.value)),
    [allowedTransitions],
  )

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: getDefaultValues(initialValues),
  })

  const handleFormSubmit = async (values: ReservationFormValues) => {
    if (initialValues?.status && !canTransition(initialValues.status, values.status)) {
      setError('root.transition', {
        type: 'manual',
        message: 'Transição de status inválida para esta reserva.',
      })
      return
    }

    if (hasTimeConflict(values, existingReservations, currentReservationId)) {
      setError('root.conflict', {
        type: 'manual',
        message: 'Já existe uma reserva em conflito nesse horário para a mesma data.',
      })
      return
    }

    await onSubmit(values)
    reset(getDefaultValues(initialValues))
  }

  const fieldSx = {
    '& .MuiInputLabel-root': {
      color: 'text.secondary',
      fontWeight: 500,
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      backgroundColor: 'background.paper',
      '& fieldset': {
        borderColor: 'divider',
      },
      '&:hover fieldset': {
        borderColor: 'divider',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'primary.main',
      },
    },
    '& .MuiInputBase-input': {
      color: 'text.primary',
    },
    '& .MuiFormHelperText-root': {
      marginLeft: 0,
    },
  }

  const selectWrapperSx = {
    '& .MuiFormLabel-root': {
      color: 'text.secondary',
      fontWeight: 500,
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      backgroundColor: 'background.paper',
      '& fieldset': {
        borderColor: 'divider',
      },
      '&:hover fieldset': {
        borderColor: 'divider',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'primary.main',
      },
    },
    '& .MuiSelect-select': {
      color: 'text.primary',
    },
  }

  return (
    <Stack
      component="form"
      spacing={2.25}
      onSubmit={handleSubmit(handleFormSubmit)}
      sx={{
        p: { xs: 1, md: 1.25 },
        borderRadius: 2,
        backgroundColor: 'transparent',
      }}
    >
      <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700 }}>
        Dados da reserva
      </Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Input
          label="Título"
          size="small"
          {...register('title')}
          error={Boolean(errors.title)}
          helperText={errors.title?.message}
          sx={fieldSx}
        />
        <Input
          label="Usuário"
          size="small"
          {...register('user')}
          error={Boolean(errors.user)}
          helperText={errors.user?.message}
          sx={fieldSx}
        />
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Input
          label="Data"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          {...register('date')}
          error={Boolean(errors.date)}
          helperText={errors.date?.message}
          sx={fieldSx}
        />

        <Box sx={{ width: '100%', ...selectWrapperSx }}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                label="Status"
                options={statusOptions}
                value={field.value}
                onChange={field.onChange}
                size="small"
                error={Boolean(errors.status)}
                helperText={errors.status?.message}
              />
            )}
          />
        </Box>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Input
          label="Início"
          type="time"
          size="small"
          InputLabelProps={{ shrink: true }}
          {...register('startTime')}
          error={Boolean(errors.startTime)}
          helperText={errors.startTime?.message}
          sx={fieldSx}
        />
        <Input
          label="Fim"
          type="time"
          size="small"
          InputLabelProps={{ shrink: true }}
          {...register('endTime')}
          error={Boolean(errors.endTime)}
          helperText={errors.endTime?.message}
          sx={fieldSx}
        />
      </Stack>

      {errors.root?.conflict?.message ? (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {errors.root.conflict.message}
        </Alert>
      ) : null}
      {errors.root?.transition?.message ? (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {errors.root.transition.message}
        </Alert>
      ) : null}

      <Stack direction="row" spacing={1}>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          sx={{ minHeight: 42, px: 2.25, fontWeight: 600 }}
        >
          {isSubmitting ? 'Salvando...' : submitLabel}
        </Button>
        {onCancel ? (
          <Button
            type="button"
            variant="outlined"
            onClick={onCancel}
            sx={{ minHeight: 42, px: 2.25, fontWeight: 600 }}
          >
            {cancelLabel}
          </Button>
        ) : null}
      </Stack>
    </Stack>
  )
}
