"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface User {
  id: string
  email: string
  fullName: string
  isAdmin: boolean
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, isAdmin: boolean) => Promise<void>
  signup: (email: string, password: string, fullName: string) => Promise<void>
  adminSignup: (email: string, password: string, fullName: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem("auth_user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Error loading auth user:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadUser()
  }, [])

  const login = async (email: string, password: string, isAdmin: boolean) => {
    setIsLoading(true)
    try {
      // In production, this would call a backend API
      // For now, we'll simulate authentication with localStorage
      const users = JSON.parse(localStorage.getItem("pos_users") || "[]")
      const foundUser = users.find(
        (u: any) => u.email === email && u.password === password && u.isAdmin === isAdmin
      )

      if (!foundUser) {
        throw new Error("Invalid email or password")
      }

      const authUser: User = {
        id: foundUser.id,
        email: foundUser.email,
        fullName: foundUser.fullName,
        isAdmin: foundUser.isAdmin,
        createdAt: foundUser.createdAt,
      }

      setUser(authUser)
      localStorage.setItem("auth_user", JSON.stringify(authUser))
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, fullName: string) => {
    setIsLoading(true)
    try {
      const users = JSON.parse(localStorage.getItem("pos_users") || "[]")

      // Check if user already exists
      if (users.some((u: any) => u.email === email)) {
        throw new Error("User already exists")
      }

      // Check if employee signup is enabled
      const settings = JSON.parse(localStorage.getItem("pos_settings") || "{}")
      if (!settings.allowEmployeeSignup) {
        throw new Error("Employee signup is currently disabled. Contact your administrator.")
      }

      const newUser = {
        id: `user_${Date.now()}`,
        email,
        password, // In production, this should be hashed
        fullName,
        isAdmin: false,
        createdAt: new Date().toISOString(),
      }

      users.push(newUser)
      localStorage.setItem("pos_users", JSON.stringify(users))

      const authUser: User = {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        isAdmin: false,
        createdAt: newUser.createdAt,
      }

      setUser(authUser)
      localStorage.setItem("auth_user", JSON.stringify(authUser))
    } finally {
      setIsLoading(false)
    }
  }

  const adminSignup = async (email: string, password: string, fullName: string) => {
    setIsLoading(true)
    try {
      const users = JSON.parse(localStorage.getItem("pos_users") || "[]")

      // Check if user already exists
      if (users.some((u: any) => u.email === email)) {
        throw new Error("User already exists")
      }

      const newAdmin = {
        id: `user_${Date.now()}`,
        email,
        password, // In production, this should be hashed
        fullName,
        isAdmin: true,
        createdAt: new Date().toISOString(),
      }

      users.push(newAdmin)
      localStorage.setItem("pos_users", JSON.stringify(users))

      const authUser: User = {
        id: newAdmin.id,
        email: newAdmin.email,
        fullName: newAdmin.fullName,
        isAdmin: true,
        createdAt: newAdmin.createdAt,
      }

      setUser(authUser)
      localStorage.setItem("auth_user", JSON.stringify(authUser))
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setUser(null)
    localStorage.removeItem("auth_user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        adminSignup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
