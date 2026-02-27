import { useId } from 'react'
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  type SelectChangeEvent,
  type SelectProps as MuiSelectProps,
} from '@mui/material'

export type SelectOption = {
  label: string
  value: string
}

export interface SelectProps extends Omit<MuiSelectProps<string>, 'onChange' | 'value'> {
  label: string
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  helperText?: string
}

export function Select({
  label,
  options,
  value,
  onChange,
  helperText,
  fullWidth = true,
  error,
  ...props
}: SelectProps) {
  const id = useId()

  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value)
  }

  return (
    <FormControl fullWidth={fullWidth} error={error}>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <MuiSelect
        labelId={`${id}-label`}
        id={`${id}-select`}
        label={label}
        value={value}
        onChange={handleChange}
        {...props}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  )
}
