"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
  email: string
  name: string
}

interface StoredUser {
  email: string
  name: string
  password: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const USERS_KEY = "memora_users"
const CURRENT_USER_KEY = "memora_current_user"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY)
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem(CURRENT_USER_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const getStoredUsers = (): StoredUser[] => {
    const users = localStorage.getItem(USERS_KEY)
    if (users) {
      try {
        return JSON.parse(users)
      } catch {
        return []
      }
    }
    return []
  }

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const users = getStoredUsers()
    
    // Check if user already exists
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "An account with this email already exists" }
    }

    // Create new user
    const newUser: StoredUser = { email, name, password }
    users.push(newUser)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))

    // Log them in
    const sessionUser = { email, name }
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser))
    setUser(sessionUser)

    return { success: true }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const users = getStoredUsers()
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )

    if (!foundUser) {
      return { success: false, error: "Invalid email or password" }
    }

    const sessionUser = { email: foundUser.email, name: foundUser.name }
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser))
    setUser(sessionUser)

    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY)
    setUser(null)
  }

  // Don't render children until we've checked for existing session
  if (isLoading) {
    return null
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
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
