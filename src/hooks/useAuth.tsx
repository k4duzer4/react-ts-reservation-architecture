import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react'

type AuthUser = {
  name: string
}

type AuthContextValue = {
  isAuthenticated: boolean
  user: AuthUser | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AUTH_STORAGE_KEY = 'reservation-auth-user'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY)
    return storedUser ? (JSON.parse(storedUser) as AuthUser) : null
  })

  const login = async (username: string, _password: string) => {
    const nextUser: AuthUser = { name: username.trim() || 'Usuário' }

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
  }

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(user),
      user,
      login,
      logout,
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }

  return context
}
