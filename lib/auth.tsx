"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "member" | "dentist" | "hygienist" | "assistant" | "office_manager" | "owner"
  clinic?: {
    clinicName: string
    clinicType: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
    phone: string
    email?: string
    website?: string
    licenseNumber?: string
    establishedYear?: string
    description?: string
  }
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (userData: any) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem("cavity_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Dummy authentication - accept any email/password
    if (email && password) {
      const dummyUser: User = {
        id: "1",
        email,
        name: email.split("@")[0],
        role: email.includes("admin") ? "admin" : "dentist", // Set admin role if email contains 'admin'
      }

      setUser(dummyUser)
      localStorage.setItem("cavity_user", JSON.stringify(dummyUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const signup = async (userData: any): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create new user account
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      name: `${userData.firstName} ${userData.lastName}`,
      role: userData.role,
      clinic: userData.clinic
    }

    setUser(newUser)
    localStorage.setItem("cavity_user", JSON.stringify(newUser))
    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("cavity_user")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Route protection component
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !user && pathname !== "/login" && pathname !== "/signup") {
      router.push("/login")
    }
  }, [user, isLoading, router, pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user && pathname !== "/login" && pathname !== "/signup") {
    return null
  }

  return <>{children}</>
}

// Admin route protection component
export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return <>{children}</>
}
