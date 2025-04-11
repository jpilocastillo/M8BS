"use client"

import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"
import firebaseConfig from "./config"

// Initialize Firebase
let app
let auth
let db
let storage

// Function to initialize Firebase
export function initializeFirebase() {
  // Skip initialization on server
  if (typeof window === "undefined") {
    console.log("Running on server, skipping Firebase initialization")
    return { app: null, auth: null, db: null, storage: null }
  }

  // Return cached instances if already initialized
  if (app && auth && db && storage) {
    return { app, auth, db, storage }
  }

  try {
    console.log("Initializing Firebase...")

    // Initialize Firebase app
    if (!getApps().length) {
      console.log("No Firebase app found, initializing new app")
      app = initializeApp(firebaseConfig)
    } else {
      console.log("Firebase app already exists, getting existing app")
      app = getApp()
    }

    // Initialize services
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)

    console.log("Firebase initialization complete")

    return { app, auth, db, storage }
  } catch (error) {
    console.error("Firebase initialization error:", error)
    return { app: null, auth: null, db: null, storage: null }
  }
}

// Initialize Firebase on import
const {
  app: initializedApp,
  auth: initializedAuth,
  db: initializedDb,
  storage: initializedStorage,
} = typeof window !== "undefined" ? initializeFirebase() : { app: null, auth: null, db: null, storage: null }

// Export initialized instances
export { initializedApp as app, initializedAuth as auth, initializedDb as db, initializedStorage as storage }
