"use client"

import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3dI7vF0QXf7nQqH2_vGylR5LuDwl8xZQ",
  authDomain: "m8bs-c4f3d.firebaseapp.com",
  projectId: "m8bs-c4f3d",
  storageBucket: "m8bs-c4f3d.firebasestorage.app",
  messagingSenderId: "976462758272",
  appId: "1:976462758272:web:8801f8edb038a12e31c165",
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore(app)
const storage = getStorage(app)

export { app, db, storage }

