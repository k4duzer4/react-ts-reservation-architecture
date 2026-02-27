import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  type DialogProps,
} from '@mui/material'
import type { ReactNode } from 'react'

export interface ModalProps extends Omit<DialogProps, 'onClose'> {
  open: boolean
  heading: ReactNode
  children: ReactNode
  onClose: () => void
  onConfirm?: () => void
  confirmLabel?: string
  cancelLabel?: string
  isConfirmDisabled?: boolean
}

export function Modal({
  open,
  heading,
  children,
  onClose,
  onConfirm,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  isConfirmDisabled = false,
  ...props
}: ModalProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" {...props}>
      <DialogTitle>{heading}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{cancelLabel}</Button>
        {onConfirm ? (
          <Button onClick={onConfirm} variant="contained" disabled={isConfirmDisabled}>
            {confirmLabel}
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  )
}
