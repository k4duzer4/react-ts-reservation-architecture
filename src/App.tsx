import { useMemo } from 'react'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/hooks/useAuth'
import { ThemeModeProvider, useThemeMode } from '@/hooks/useThemeMode'
import { AppRouter } from '@/routes/AppRouter'

function AppContent() {
  const { mode } = useThemeMode()

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'dark'
            ? {
                background: {
                  default: '#0f172a',
                  paper: '#111c31',
                },
                text: {
                  primary: '#e5e7eb',
                  secondary: '#94a3b8',
                },
                divider: 'rgba(148, 163, 184, 0.22)',
                action: {
                  hover: 'rgba(148, 163, 184, 0.1)',
                  selected: 'rgba(148, 163, 184, 0.16)',
                },
              }
            : {
                background: {
                  default: '#f8fafc',
                  paper: '#ffffff',
                },
              }),
        },
        shape: {
          borderRadius: 10,
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
        },
      }),
    [mode],
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

function App() {
  return (
    <ThemeModeProvider>
      <AppContent />
    </ThemeModeProvider>
  )
}

export default App
