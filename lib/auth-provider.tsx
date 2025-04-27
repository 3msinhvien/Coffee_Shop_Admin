"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  previewMode: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [previewMode, setPreviewMode] = useState(true) // Set preview mode to true by default
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token")
    if (token) {
      setIsAuthenticated(true)
      setPreviewMode(false) // Turn off preview mode when authenticated
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    try {
      // In a real app, this would call your API
      // For demo purposes, we'll just simulate a successful login
      if (username && password) {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Store token in localStorage
        localStorage.setItem("token", "demo-token")
        setIsAuthenticated(true)
        setPreviewMode(false) // Turn off preview mode when authenticated
        return
      }
      throw new Error("Invalid credentials")
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setIsAuthenticated(false)
    setPreviewMode(true) // Turn on preview mode when logged out
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, previewMode, login, logout }}>
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
