"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"

interface User {
  name: string
  userId: string
}

interface AuthContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
  isLoading: boolean
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
})

// Hook to use the auth context
export function useAuth() {
  return useContext(AuthContext)
}

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for saved user in localStorage on initial load
    const savedUser = localStorage.getItem("learnquiz_user")

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Failed to parse saved user:", error)
        localStorage.removeItem("learnquiz_user")
      }
    }

    setIsLoading(false)
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    // Save to localStorage
    localStorage.setItem("learnquiz_user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    // Remove from localStorage
    localStorage.removeItem("learnquiz_user")
  }

  const value = {
    user,
    login,
    logout,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

