"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

type UserRole =
  | "admin"
  | "staff"
  | "member"
  | "dentist"
  | "hygienist"
  | "assistant"
  | "office_manager"
  | "owner"

interface User {
  id: string
  email: string
  name: string
  role: UserRole
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
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (userData: any) => Promise<boolean>
  logout: () => Promise<void>
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

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      const data = (await response.json().catch(() => null)) as
        | { user?: User; error?: string }
        | null

      if (!response.ok || !data?.user) {
        return { success: false, error: data?.error ?? "Unable to sign in. Please try again." }
      }

      setUser(data.user)
      localStorage.setItem("cavity_user", JSON.stringify(data.user))

      return { success: true }
    } catch (error) {
      console.error("[LOGIN_FAILED]", error)
      return { success: false, error: "Unable to sign in. Please try again." }
    } finally {
      setIsLoading(false)
    }
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

  const logout = async () => {
    setIsLoading(true)

    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("[LOGOUT_FAILED]", error)
    } finally {
      setUser(null)
      localStorage.removeItem("cavity_user")
      setIsLoading(false)
      router.push("/login")
    }
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
