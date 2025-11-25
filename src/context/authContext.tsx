/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { getMyDetails, type UserDetailsResponse } from "../services/auth"

// Basic shape of user returned by backend; extend as needed
export interface User {
  email?: string
  roles?: string[]
  [key: string]: unknown
}

interface AuthContextValue {
  user: User | null
  setUser: (u: User | null) => void
  loading: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const hasToken = typeof window !== "undefined" && !!localStorage.getItem("accessToken")
  const [loading, setLoading] = useState<boolean>(hasToken)

  useEffect(() => {
    if (!hasToken) return

    let canceled = false
    ;(async () => {
      try {
        const res: UserDetailsResponse = await getMyDetails()
        if (!canceled) setUser(res.data || null)
      } catch (err) {
        if (!canceled) setUser(null)
        console.error(err)
      } finally {
        if (!canceled) setLoading(false)
      }
    })()

    return () => {
      canceled = true
    }
  }, [hasToken])

  return <AuthContext.Provider value={{ user, setUser, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
