import { TextField, type TextFieldProps } from '@mui/material'

export type InputProps = TextFieldProps

export function Input({ fullWidth = true, ...props }: InputProps) {
  return <TextField fullWidth={fullWidth} {...props} />
}
