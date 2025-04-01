"use client"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3dI7vF0QXf7nQqH2_vGylR5LuDwl8xZQ",
  authDomain: "m8bs-c4f3d.firebaseapp.com",
  projectId: "m8bs-c4f3d",
  storageBucket: "m8bs-c4f3d.firebasestorage.app",
  messagingSenderId: "976462758272",
  appId: "1:976462758272:web:8801f8edb038a12e31c165",
}

// Test user credentials
export const TEST_USER = {
  email: "test@example.com",
  password: "password123",
  name: "Test User",
  hasData: true,
}

// Initialize Firebase app
let firebaseInitialized = false
let app
let auth
let db
let storage

// Simple function to initialize Firebase once
export const initializeFirebase = async () => {
  // Skip initialization on server
  if (typeof window === "undefined") {
    console.log("Running on server, skipping Firebase initialization")
    return { app: null, auth: null, db: null, storage: null }
  }

  // Return cached instances if already initialized
  if (firebaseInitialized && app && db) {
    return { app, auth, db, storage }
  }

  try {
    console.log("Initializing Firebase...")

    // Import Firebase core first
    const { initializeApp, getApps, getApp } = await import("firebase/app")

    // Initialize Firebase app
    if (!getApps().length) {
      console.log("No Firebase app found, initializing new app")
      app = initializeApp(firebaseConfig)
    } else {
      console.log("Firebase app already exists, getting existing app")
      app = getApp()
    }

    // Import and initialize Firestore
    const { getFirestore } = await import("firebase/firestore")
    db = getFirestore(app)
    console.log("Firestore initialized")

    // Import and initialize Auth (only if needed)
    try {
      const { getAuth } = await import("firebase/auth")
      auth = getAuth(app)
      console.log("Firebase Auth initialized")
    } catch (authError) {
      console.warn("Failed to initialize Firebase Auth:", authError)
      auth = null
    }

    // Import and initialize Storage (only if needed)
    try {
      const { getStorage } = await import("firebase/storage")
      storage = getStorage(app)
      console.log("Firebase Storage initialized")
    } catch (storageError) {
      console.warn("Failed to initialize Firebase Storage:", storageError)
      storage = null
    }

    firebaseInitialized = true
    console.log("Firebase initialization complete")

    return { app, auth, db, storage }
  } catch (error) {
    console.error("Firebase initialization error:", error)
    return { app: null, auth: null, db: null, storage: null }
  }
}

// Function to register a new user
export async function registerUser(email: string, password: string, name: string) {
  try {
    const { auth } = await initializeFirebase()
    if (!auth) throw new Error("Auth not initialized")

    const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth")

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

// Function to sign out
export async function signOutUser() {
  try {
    const { auth } = await initializeFirebase()
    if (auth) {
      const { signOut } = await import("firebase/auth")
      await signOut(auth)
    }

    localStorage.removeItem("user")
    return { success: true }
  } catch (error) {
    console.error("Sign out error:", error)
    return { success: false, error }
  }
}

// Custom login function that handles both test user and Firebase auth
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
    const { auth } = await initializeFirebase()
    if (!auth) throw new Error("Auth not initialized")

    const { signInWithEmailAndPassword } = await import("firebase/auth")
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

// Function to get the current user from localStorage
export function getCurrentUser() {
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

// Export for backward compatibility
export { app, auth, db, storage }

