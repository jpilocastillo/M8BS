"use client"

import { useState, useEffect } from "react"
import { app } from "./firebase-config"

// Test user credentials
export const TEST_USER = {
  email: "test@example.com",
  password: "password123",
  name: "Test User",
  hasData: true,
}

// Define user type
export interface FirebaseUser {
  uid?: string
  email: string | null
  displayName?: string | null
  name?: string | null
  photoURL?: string | null
  isLoggedIn?: boolean
}

// Custom hook for Firebase Auth
export function useFirebaseAuth() {
  const [auth, setAuth] = useState<any>(null)
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<Error | null>(null)

  // Initialize Firebase Auth
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if we're in the browser
        if (typeof window === "undefined") return

        // Check if we have a user in localStorage first
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }

        // Dynamically import Firebase Auth
        const { getAuth } = await import("firebase/auth")
        const authInstance = getAuth(app)
        setAuth(authInstance)

        // Set up auth state listener
        const { onAuthStateChanged } = await import("firebase/auth")
        const unsubscribe = onAuthStateChanged(authInstance, (firebaseUser) => {
          if (firebaseUser) {
            // User is signed in
            const userData: FirebaseUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              isLoggedIn: true,
            }
            setUser(userData)
            localStorage.setItem("user", JSON.stringify(userData))
          } else {
            // Only set user to null if we don't have a stored user
            if (!storedUser) {
              setUser(null)
            }
          }
          setLoading(false)
        })

        return () => unsubscribe()
      } catch (error) {
        console.error("Firebase Auth initialization error:", error)
        setAuthError(error instanceof Error ? error : new Error("Unknown auth error"))
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      // Check if it's the test user
      if (email === TEST_USER.email && password === TEST_USER.password) {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Create test user data
        const testUserData = {
          email: TEST_USER.email,
          name: TEST_USER.name,
          isLoggedIn: true,
          hasData: true,
        }

        // Store user info in localStorage
        localStorage.setItem("user", JSON.stringify(testUserData))
        localStorage.setItem("hasData", "true")
        localStorage.setItem("onboardingComplete", "true")

        setUser(testUserData)
        return { success: true, user: testUserData }
      }

      // If not test user, use Firebase Auth
      if (!auth) throw new Error("Auth not initialized")

      const { signInWithEmailAndPassword } = await import("firebase/auth")
      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      // User will be set by the auth state listener
      return { success: true, user: userCredential.user }
    } catch (error) {
      console.error("Sign in error:", error)
      return { success: false, error }
    }
  }

  // Sign up function
  const signUp = async (email: string, password: string, name: string) => {
    try {
      if (!auth) throw new Error("Auth not initialized")

      const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth")
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Update profile with name
      await updateProfile(userCredential.user, {
        displayName: name,
      })

      // User will be set by the auth state listener
      return { success: true, user: userCredential.user }
    } catch (error) {
      console.error("Sign up error:", error)
      return { success: false, error }
    }
  }

  // Sign out function
  const signOut = async () => {
    try {
      if (auth) {
        const { signOut: firebaseSignOut } = await import("firebase/auth")
        await firebaseSignOut(auth)
      }

      localStorage.removeItem("user")
      setUser(null)
      return { success: true }
    } catch (error) {
      console.error("Sign out error:", error)
      return { success: false, error }
    }
  }

  return {
    auth,
    user,
    loading,
    authError,
    signIn,
    signUp,
    signOut,
  }
}

