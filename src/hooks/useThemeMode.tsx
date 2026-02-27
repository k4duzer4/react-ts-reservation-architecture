import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import type { PaletteMode } from '@mui/material'

type ThemeModeContextValue = {
  mode: PaletteMode
  toggleMode: () => void
}

const THEME_MODE_STORAGE_KEY = 'reservation-theme-mode'

const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(undefined)

export function ThemeModeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<PaletteMode>(() => {
    const storedMode = localStorage.getItem(THEME_MODE_STORAGE_KEY)
    return storedMode === 'dark' ? 'dark' : 'light'
  })

  const toggleMode = () => {
    setMode((previousMode) => {
      const nextMode: PaletteMode = previousMode === 'light' ? 'dark' : 'light'
      localStorage.setItem(THEME_MODE_STORAGE_KEY, nextMode)
      return nextMode
    })
  }

  const value = useMemo(
    () => ({
      mode,
      toggleMode,
    }),
    [mode],
  )

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>
}

export function useThemeMode() {
  const context = useContext(ThemeModeContext)

  if (!context) {
    throw new Error('useThemeMode deve ser usado dentro de ThemeModeProvider')
  }

  return context
}
