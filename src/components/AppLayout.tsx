import { useState } from 'react'
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import EventSeatRoundedIcon from '@mui/icons-material/EventSeatRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import { Link as RouterLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useThemeMode } from '@/hooks/useThemeMode'

const drawerWidth = 240
const miniDrawerWidth = 72

export function AppLayout() {
  const { user, logout } = useAuth()
  const { mode, toggleMode } = useThemeMode()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopOpen, setDesktopOpen] = useState(true)
  const theme = useTheme()

  const isDark = mode === 'dark'

  const shellBackground = isDark ? '#020617' : '#f3f4f6'
  const appBarBackground = isDark ? '#0b1220' : '#ffffff'
  const appBarText = isDark ? '#e2e8f0' : '#0f172a'
  const drawerBackground = isDark ? '#0b1220' : '#ffffff'
  const drawerText = isDark ? '#d1d5db' : '#1f2937'
  const drawerSelectedBackground = isDark ? '#1e293b' : '#e2e8f0'

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const handleToggleDrawer = () => {
    setMobileOpen((prevState) => !prevState)
  }

  const handleToggleDesktopDrawer = () => {
    setDesktopOpen((prevState) => !prevState)
  }

  const closeMobileDrawer = () => {
    setMobileOpen(false)
  }

  const drawerContent = (collapsed = false) => (
    <Box
      sx={{
        height: '100%',
        backgroundColor: drawerBackground,
        color: drawerText,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          minHeight: 64,
          px: collapsed ? 0.75 : 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
        }}
      >
        {!collapsed ? (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: isDark ? '#f8fafc' : '#0f172a',
              opacity: collapsed ? 0 : 1,
              transition: theme.transitions.create('opacity', {
                duration: theme.transitions.duration.shorter,
              }),
            }}
          >
            Menu
          </Typography>
        ) : null}

        <Tooltip title={collapsed ? 'Abrir menu' : 'Fechar menu'} placement="right">
          <IconButton
            color="inherit"
            onClick={handleToggleDesktopDrawer}
            sx={{
              width: 36,
              height: 36,
              border: 1,
              borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'divider',
            }}
          >
            <MenuRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'divider' }} />

      <List sx={{ px: collapsed ? 0.75 : 1 }}>
        <ListItemButton
          component={RouterLink}
          to="/reservas"
          selected={location.pathname === '/reservas'}
          onClick={closeMobileDrawer}
          sx={{
            borderRadius: 2,
            mb: 0.5,
            minHeight: 44,
            px: collapsed ? 1 : 1.25,
            justifyContent: collapsed ? 'center' : 'flex-start',
            '&.Mui-selected': {
              backgroundColor: drawerSelectedBackground,
              color: isDark ? '#ffffff' : '#0f172a',
            },
            '&.Mui-selected:hover': {
              backgroundColor: drawerSelectedBackground,
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: 'inherit',
              minWidth: collapsed ? 0 : 36,
              mr: collapsed ? 0 : 0.5,
              justifyContent: 'center',
            }}
          >
            <EventSeatRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Reservas"
            sx={{
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : 'auto',
              transition: theme.transitions.create(['opacity', 'width'], {
                duration: theme.transitions.duration.shorter,
              }),
            }}
          />
        </ListItemButton>

        <ListItemButton
          component={RouterLink}
          to="/reservas/nova"
          selected={location.pathname === '/reservas/nova'}
          onClick={closeMobileDrawer}
          sx={{
            borderRadius: 2,
            minHeight: 44,
            px: collapsed ? 1 : 1.25,
            justifyContent: collapsed ? 'center' : 'flex-start',
            '&.Mui-selected': {
              backgroundColor: drawerSelectedBackground,
              color: isDark ? '#ffffff' : '#0f172a',
            },
            '&.Mui-selected:hover': {
              backgroundColor: drawerSelectedBackground,
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: 'inherit',
              minWidth: collapsed ? 0 : 36,
              mr: collapsed ? 0 : 0.5,
              justifyContent: 'center',
            }}
          >
            <AddCircleOutlineRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Nova reserva"
            sx={{
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : 'auto',
              transition: theme.transitions.create(['opacity', 'width'], {
                duration: theme.transitions.duration.shorter,
              }),
            }}
          />
        </ListItemButton>
      </List>

      <Box sx={{ mt: 'auto', p: 1.5 }}>
        <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'divider', mb: 1.5 }} />
        {collapsed ? (
          <Tooltip title="Sair" placement="right">
            <IconButton
              color="inherit"
              onClick={handleLogout}
              sx={{
                width: '100%',
                minHeight: 44,
                border: 1,
                borderColor: isDark ? 'rgba(255,255,255,0.24)' : 'divider',
                borderRadius: 2,
              }}
            >
              <LogoutRoundedIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Button
            fullWidth
            startIcon={<LogoutRoundedIcon />}
            variant="outlined"
            color="inherit"
            onClick={handleLogout}
            sx={{ borderColor: isDark ? 'rgba(255,255,255,0.24)' : 'divider' }}
          >
            Sair
          </Button>
        )}
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: shellBackground }}>
      <Box
        component="nav"
        sx={{
          width: { md: desktopOpen ? drawerWidth : miniDrawerWidth },
          flexShrink: { md: 0 },
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleToggleDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight: 0,
            },
          }}
        >
          {drawerContent(false)}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: desktopOpen ? drawerWidth : miniDrawerWidth,
              boxSizing: 'border-box',
              borderRight: 0,
              overflowX: 'hidden',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.standard,
              }),
            },
          }}
        >
          {drawerContent(!desktopOpen)}
        </Drawer>
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AppBar
          position="sticky"
          sx={{
            backgroundColor: appBarBackground,
            borderBottom: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(15,23,42,0.08)',
            boxShadow: 'none',
            color: appBarText,
          }}
        >
          <Toolbar sx={{ minHeight: 64, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <IconButton
                color="inherit"
                onClick={handleToggleDrawer}
                edge="start"
                sx={{ display: { md: 'none' } }}
              >
                <MenuRoundedIcon />
              </IconButton>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton
                color="inherit"
                onClick={toggleMode}
                sx={{
                  border: 1,
                  borderColor: isDark ? 'rgba(255,255,255,0.24)' : 'rgba(15,23,42,0.2)',
                }}
              >
                {isDark ? <LightModeRoundedIcon fontSize="small" /> : <DarkModeRoundedIcon fontSize="small" />}
              </IconButton>
              <Typography variant="body2" sx={{ color: isDark ? '#cbd5e1' : '#334155' }}>
                {user?.name}
              </Typography>
            </Stack>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
