"use client"

import { createContext, useState, useEffect, useContext, type ReactNode, useCallback } from "react"
import { fetchProfile } from "@/lib/api"
import type { User } from "@/lib/types"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  loading: boolean
  loginUser: (token: string, user: User) => void
  logoutUser: () => void
  refetchUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginUser: () => {},
  logoutUser: () => {},
  refetchUser: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const loginUser = useCallback((token: string, userData: User) => {
    localStorage.setItem("token", token)
    setUser(userData)
  }, [])

  const logoutUser = useCallback(() => {
    localStorage.removeItem("token")
    setUser(null)
    router.push("/login")
  }, [router])

  const refetchUser = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (token) {
      try {
        const fetchedUser = await fetchProfile()
        console.log(fetchProfile)
        setUser(fetchedUser)
      } catch (err) {
        console.error("Failed to fetch profile:", err)
        localStorage.removeItem("token")
        setUser(null)
      }
    } else {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    refetchUser().finally(() => setLoading(false))
  }, [refetchUser])

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser, refetchUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
