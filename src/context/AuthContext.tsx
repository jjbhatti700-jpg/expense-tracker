import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi, setAuthToken, getAuthToken } from '../services/api'

// ====================================
// TYPES
// ====================================

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

interface AuthProviderProps {
  children: ReactNode
}

// ====================================
// CREATE CONTEXT
// ====================================

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ====================================
// PROVIDER COMPONENT
// ====================================

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken()
      
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const response = await authApi.getMe()
        if (response.success && response.data) {
          setUser(response.data)
        } else {
          // If response is not successful, clear token and user
          setAuthToken(null)
          setUser(null)
        }
      } catch (err) {
        // If token is invalid or expired, clear everything
        console.error('Auth check failed:', err)
        setAuthToken(null)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setError(null)
      setIsLoading(true)
      
      const response = await authApi.login(email, password)
      
      if (response.success && response.data) {
        setAuthToken(response.data.token)
        setUser(response.data.user)
      } else {
        throw new Error('Login failed')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    try {
      setError(null)
      setIsLoading(true)
      
      const response = await authApi.signup(name, email, password)
      
      if (response.success && response.data) {
        setAuthToken(response.data.token)
        setUser(response.data.user)
      } else {
        throw new Error('Signup failed')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setAuthToken(null)
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login,
    signup,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ====================================
// CUSTOM HOOK
// ====================================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

export default AuthContext