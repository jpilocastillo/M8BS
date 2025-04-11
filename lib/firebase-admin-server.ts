import * as admin from "firebase-admin"

// Initialize Firebase Admin SDK
let firebaseAdmin: admin.app.App | null = null
let firebaseAuth: admin.auth.Auth | null = null
let firebaseDb: admin.firestore.Firestore | null = null

export function initializeFirebaseAdmin() {
  // Return cached instances if already initialized
  if (firebaseAdmin && firebaseAuth && firebaseDb) {
    return { admin: firebaseAdmin, auth: firebaseAuth, db: firebaseDb }
  }

  try {
    // Check if any Firebase Admin apps have been initialized
    if (admin.apps.length === 0) {
      // Get environment variables
      const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
      const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
      const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n")

      if (!projectId || !clientEmail || !privateKey) {
        throw new Error("Firebase Admin environment variables are missing")
      }

      // Initialize the app
      firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      })
    } else {
      firebaseAdmin = admin.apps[0] as admin.app.App
    }

    // Initialize services
    firebaseAuth = admin.auth(firebaseAdmin)
    firebaseDb = admin.firestore(firebaseAdmin)

    return { admin: firebaseAdmin, auth: firebaseAuth, db: firebaseDb }
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error)
    throw error
  }
}
