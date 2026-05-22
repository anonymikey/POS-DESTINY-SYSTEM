'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { loginUser, signupUser, getUserById, createEmployee, isEmployeeSignupAllowed } from '@/app/services/auth-db'

export interface User {
  id: string
  email: string
  full_name: string | null
  role: 'admin' | 'employee'
  is_active: boolean
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  userRole: 'admin' | 'employee' | null
  login: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>
  signup: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error: string | null }>
  adminSignup: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error: string | null }>
  createEmployeeAccount: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error: string | null }>
  logout: () => Promise<void>
  sessionToken: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from session storage on mount (in-memory session only, no localStorage)
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Sessions are now stored only in memory via sessionToken
        // This ensures logout clears everything when user closes tab/browser
        setIsLoading(false)
      } catch (error) {
        console.error('[v0] Error loading auth user:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadUser()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error: string | null }> => {
    setIsLoading(true)
    try {
      const { user: dbUser, error } = await loginUser({ email, password })

      if (error || !dbUser) {
        return { success: false, error: error || 'Login failed' }
      }

      // Generate a session token (in-memory only, no localStorage)
      const token = `session_${dbUser.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      setUser(dbUser)
      setSessionToken(token)
      return { success: true, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during login'
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, fullName: string): Promise<{ success: boolean; error: string | null }> => {
    setIsLoading(true)
    try {
      // Check if employee signup is allowed
      const signupAllowed = await isEmployeeSignupAllowed()
      if (!signupAllowed) {
        return { success: false, error: 'Employee signup is currently disabled. Contact your administrator.' }
      }

      const { user: newUser, error } = await signupUser({
        email,
        password,
        full_name: fullName,
        role: 'employee',
      })

      if (error || !newUser) {
        return { success: false, error: error || 'Signup failed' }
      }

      const token = `session_${newUser.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      setUser(newUser)
      setSessionToken(token)
      return { success: true, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during signup'
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const adminSignup = async (email: string, password: string, fullName: string): Promise<{ success: boolean; error: string | null }> => {
    setIsLoading(true)
    try {
      const { user: newAdmin, error } = await signupUser({
        email,
        password,
        full_name: fullName,
        role: 'admin',
      })

      if (error || !newAdmin) {
        return { success: false, error: error || 'Admin signup failed' }
      }

      const token = `session_${newAdmin.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      setUser(newAdmin)
      setSessionToken(token)
      return { success: true, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during signup'
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const createEmployeeAccount = async (email: string, password: string, fullName: string): Promise<{ success: boolean; error: string | null }> => {
    setIsLoading(true)
    try {
      const { user: newEmployee, error } = await createEmployee({
        email,
        password,
        full_name: fullName,
      })

      if (error || !newEmployee) {
        return { success: false, error: error || 'Failed to create employee account' }
      }

      return { success: true, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setUser(null)
    setSessionToken(null)
    // Clear any remaining localStorage auth keys for security
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_user')
      localStorage.removeItem('pos_employee_access')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        userRole: user?.role || null,
        login,
        signup,
        adminSignup,
        createEmployeeAccount,
        logout,
        sessionToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
