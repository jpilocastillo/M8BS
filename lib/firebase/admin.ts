import * as admin from "firebase-admin"

// Initialize Firebase Admin SDK
const firebaseAdmin: admin.app.App | null = null

function initializeFirebaseAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp()
  }

  return admin.app()
}

// Initialize Firebase Admin on import
const app = initializeFirebaseAdmin()

// Export Firebase Admin services
export const getAdminAuth = () => admin.auth(app)
export const getAdminFirestore = () => admin.firestore(app)

export { admin }
