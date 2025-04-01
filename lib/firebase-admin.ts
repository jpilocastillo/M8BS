// This file provides admin-specific Firebase functionality for client-side use
import { initializeFirebase } from "./firebase"
import { getIdToken } from "firebase/auth"

// Add TEST_USER import at the top of the file
import { TEST_USER } from "@/lib/auth"

// Update the checkIsAdmin function to handle test user
export async function checkIsAdmin(email: string) {
  try {
    // If it's the test user, return true immediately
    if (email === TEST_USER.email) {
      return true
    }

    const { auth } = await initializeFirebase()
    if (!auth || !auth.currentUser) {
      console.warn("No authenticated user when checking admin status")
      return false
    }

    // Get the ID token for the current user
    const token = await getIdToken(auth.currentUser, true)

    // Call the API to verify admin status
    const response = await fetch("/api/admin/verify", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return false
    }

    const data = await response.json()
    return data.isAdmin
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}

// Update the fetchUsers function to handle test user
export async function fetchUsers() {
  try {
    // If it's the test user, return mock data
    if (isTestUser()) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      return {
        success: true,
        users: [
          {
            uid: "test-admin-1",
            email: "admin@example.com",
            displayName: "Admin User",
            role: "admin",
            lastActive: new Date().toISOString(),
          },
          {
            uid: "test-user-1",
            email: "user1@example.com",
            displayName: "Test User 1",
            role: "user",
            lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            uid: "test-user-2",
            email: TEST_USER.email,
            displayName: TEST_USER.name,
            role: "user",
            lastActive: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          },
        ],
      }
    }

    const { auth } = await initializeFirebase()
    if (!auth || !auth.currentUser) {
      throw new Error("No authenticated user")
    }

    // Get the ID token for the current user
    const token = await getIdToken(auth.currentUser, true)

    // Call the API to get users
    const response = await fetch("/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to fetch users")
    }

    const data = await response.json()
    return {
      success: true,
      users: data.users,
    }
  } catch (error) {
    console.error("Error fetching users:", error)
    return {
      success: false,
      error,
    }
  }
}

// Function to create a new user via the API
export async function createUserViaApi(userData: {
  email: string
  name: string
  role: string
}) {
  try {
    const { auth } = await initializeFirebase()
    if (!auth || !auth.currentUser) {
      throw new Error("No authenticated user")
    }

    // Get the ID token for the current user
    const token = await getIdToken(auth.currentUser, true)

    // Call the API to create a user
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to create user")
    }

    const data = await response.json()
    return {
      success: true,
      user: data.user,
      tempPassword: data.user.tempPassword,
    }
  } catch (error) {
    console.error("Error creating user:", error)
    return {
      success: false,
      error,
    }
  }
}

// Function to delete a user via the API
export async function deleteUserViaApi(uid: string) {
  try {
    const { auth } = await initializeFirebase()
    if (!auth || !auth.currentUser) {
      throw new Error("No authenticated user")
    }

    // Get the ID token for the current user
    const token = await getIdToken(auth.currentUser, true)

    // Call the API to delete a user
    const response = await fetch(`/api/users/${uid}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to delete user")
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error deleting user:", error)
    return {
      success: false,
      error,
    }
  }
}

// Function to log a system event
export async function logSystemEvent(type: string, details: string, userId?: string) {
  try {
    const { db } = await initializeFirebase()
    if (!db) {
      console.warn("Firestore not initialized when logging system event")
      return { success: false, error: "Firestore not initialized" }
    }

    // For system events, we'll continue to use the client-side approach
    // In a full implementation, you might want to create an API endpoint for this too
    const { addDoc, collection, serverTimestamp } = await import("firebase/firestore")

    await addDoc(collection(db, "events"), {
      type,
      details,
      userId,
      timestamp: serverTimestamp(),
    })

    return { success: true }
  } catch (error) {
    console.error("Error logging system event:", error)
    return { success: false, error }
  }
}

// Helper function to check if current user is test user
function isTestUser() {
  if (typeof window === "undefined") return false

  const storedUser = localStorage.getItem("user")
  if (!storedUser) return false

  try {
    const user = JSON.parse(storedUser)
    return user.email === TEST_USER.email
  } catch (e) {
    return false
  }
}

