import { Alert, Snackbar, type AlertColor } from '@mui/material'

type ToastProps = {
  open: boolean
  message: string
  severity?: AlertColor
  onClose: () => void
  autoHideDuration?: number
}

export function Toast({
  open,
  message,
  severity = 'success',
  onClose,
  autoHideDuration = 3000,
}: ToastProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert severity={severity} onClose={onClose} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}
