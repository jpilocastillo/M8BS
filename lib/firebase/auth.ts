"use client"

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth"
import { auth } from "./client"
import { TEST_USER } from "./config"

// Define user type
export interface FirebaseUser {
  uid?: string
  email: string | null
  displayName?: string | null
  name?: string | null
  photoURL?: string | null
  isLoggedIn?: boolean
  hasData?: boolean
}

// Function to register a new user
export async function registerUser(email: string, password: string, name: string) {
  try {
    if (!auth) throw new Error("Auth not initialized")

    // Create user with Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)

    // Update profile with name
    await updateProfile(userCredential.user, {
      displayName: name,
    })

    // Create user object
    const user = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      name: name,
      isLoggedIn: true,
    }

    // Store user info in localStorage
    localStorage.setItem("user", JSON.stringify(user))

    return {
      success: true,
      user,
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      error,
    }
  }
}

// Function to sign in
export async function loginUser(email: string, password: string) {
  try {
    // Check if it's the test user first
    if (email === TEST_USER.email && password === TEST_USER.password) {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Create user object
      const user = {
        email: TEST_USER.email,
        name: TEST_USER.name,
        isLoggedIn: true,
        hasData: true,
      }

      // Store user info in localStorage to maintain session
      localStorage.setItem("user", JSON.stringify(user))

      // Set hasData flag for test user
      localStorage.setItem("hasData", "true")
      localStorage.setItem("onboardingComplete", "true")

      return {
        success: true,
        user,
      }
    }

    // If not test user, try Firebase authentication
    if (!auth) throw new Error("Auth not initialized")

    const userCredential = await signInWithEmailAndPassword(auth, email, password)

    // Create user object
    const user = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      name: userCredential.user.displayName || email.split("@")[0],
      isLoggedIn: true,
    }

    // Store user info in localStorage for persistence
    localStorage.setItem("user", JSON.stringify(user))

    return {
      success: true,
      user,
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      error,
    }
  }
}

// Function to sign out
export async function signOutUser() {
  try {
    if (auth) {
      await firebaseSignOut(auth)
    }

    localStorage.removeItem("user")
    return { success: true }
  } catch (error) {
    console.error("Sign out error:", error)
    return { success: false, error }
  }
}

// Function to get the current user from localStorage
export function getCurrentUser(): FirebaseUser | null {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("user")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch (error) {
    console.error("Error parsing user from localStorage:", error)
    return null
  }
}

// Custom hook for Firebase Auth (for backward compatibility)
export function useFirebaseAuth() {
  // This is a simplified version that maintains the same interface
  // but uses our consolidated auth functions
  return {
    auth,
    user: getCurrentUser(),
    loading: false,
    authError: null,
    signIn: async (email: string, password: string) => loginUser(email, password),
    signUp: async (email: string, password: string, name: string) => registerUser(email, password, name),
    signOut: signOutUser,
  }
}
