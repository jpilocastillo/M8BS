import type { NextApiRequest, NextApiResponse } from "next"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { initializeApp, getApps, cert } from "firebase-admin/app"

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  })
}

const auth = getAuth()
const db = getFirestore()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { email, password, role } = req.body

  if (!email || !password || !role) {
    return res.status(400).json({ error: "Missing fields" })
  }

  try {
    // Create the user
    const userRecord = await auth.createUser({
      email,
      password,
      emailVerified: false,
      disabled: false,
    })

    // Set custom claims (optional)
    await auth.setCustomUserClaims(userRecord.uid, { role })

    // Save to Firestore
    await db.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: userRecord.email,
      role,
      createdAt: new Date().toISOString(),
    })

    return res.status(200).json({ success: true, user: userRecord })
  } catch (error: any) {
    console.error("Error creating user:", error)
    return res.status(500).json({ error: error.message || "Internal server error" })
  }
}
