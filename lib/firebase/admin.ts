// This file is for server-side only
import admin from "firebase-admin"

// Initialize Firebase Admin SDK
let adminApp: admin.app.App

// Function to initialize Firebase Admin SDK
export function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin.apps[0] as admin.app.App
  }

  try {
    // Get service account credentials from environment variables
    const serviceAccount = {
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }

    // Initialize admin SDK
    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    })

    return adminApp
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error)
    throw error
  }
}

// Get Firebase Admin services
export function getAdminAuth() {
  const app = initializeFirebaseAdmin()
  return app.auth()
}

export function getAdminFirestore() {
  const app = initializeFirebaseAdmin()
  return app.firestore()
}

export function getAdminStorage() {
  const app = initializeFirebaseAdmin()
  return app.storage()
}

// Export admin SDK for backward compatibility
export { admin }
