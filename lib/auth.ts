"use client"

// Test user credentials
export const TEST_USER = {
  email: "test@example.com",
  password: "password123",
  name: "Test User",
  hasData: true,
}

// User interface
export interface User {
  uid?: string
  email: string
  name?: string
  displayName?: string
  isLoggedIn: boolean
  hasData?: boolean
}

// Function to get the current user from localStorage
export function getCurrentUser(): User | null {
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

// Function to login a user (without Firebase)
export async function loginUser(
  email: string,
  password: string,
): Promise<{ success: boolean; user?: User; error?: any }> {
  try {
    // Check if it's the test user
    if (email === TEST_USER.email && password === TEST_USER.password) {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Create user object
      const user: User = {
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

    // For non-test users, we would normally use Firebase
    // But for now, let's just return an error
    return {
      success: false,
      error: { message: "Invalid email or password" },
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      error,
    }
  }
}

// Function to register a new user (without Firebase)
export async function registerUser(
  email: string,
  password: string,
  name: string,
): Promise<{ success: boolean; user?: User; error?: any }> {
  try {
    // For now, just create a local user
    const user: User = {
      uid: `local-${Date.now()}`,
      email,
      name,
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

// Function to sign out
export async function signOutUser(): Promise<{ success: boolean; error?: any }> {
  try {
    localStorage.removeItem("user")
    return { success: true }
  } catch (error) {
    console.error("Sign out error:", error)
    return { success: false, error }
  }
}

