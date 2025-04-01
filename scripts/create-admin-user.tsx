// This is a script you would run once to create your admin user
// You would run this locally or in a secure environment

import { initializeApp } from "firebase/app"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { getFirestore, doc, setDoc } from "firebase/firestore"

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
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// Admin user details - CHANGE THESE!
const ADMIN_EMAIL = "admin@m8bs.com"
const ADMIN_PASSWORD = "Admin@123456"
const ADMIN_NAME = "System Administrator"

async function createAdminUser() {
  try {
    // Create the user
    const userCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD)

    const user = userCredential.user

    // Add admin role to user in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: ADMIN_EMAIL,
      displayName: ADMIN_NAME,
      role: "admin",
      createdAt: new Date(),
    })

    console.log("Admin user created successfully:", user.uid)
  } catch (error) {
    console.error("Error creating admin user:", error)
  }
}

// Run the function
createAdminUser()

