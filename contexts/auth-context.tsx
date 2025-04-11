"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { getCurrentUser, loginUser, signOutUser, registerUser } from "@/lib/firebase"

// Define the shape of our user object
export interface User {
  uid?: string
  email: string | null
  displayName?: string | null
  name?: string | null
  photoURL?: string | null
  isLoggedIn?: boolean
}

// Define the shape of our context
interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; user?: any; error?: any }>
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; user?: any; error?: any }>
  signOut: () => Promise<void>
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  signOut: async () => {},
})

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext)

// Provider component to wrap the app
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === "undefined") return

    const currentUser = getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  // Sign in function
  const signIn = async (email: string, password: string) => {
    const result = await loginUser(email, password)
    if (result.success && result.user) {
      setUser(result.user)
    }
    return result
  }

  // Sign up function
  const signUp = async (email: string, password: string, name: string) => {
    const result = await registerUser(email, password, name)
    if (result.success && result.user) {
      setUser(result.user)
    }
    return result
  }

  // Sign out function
  const signOut = async () => {
    await signOutUser()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

// Re-export the User type for convenience
export type { User }
