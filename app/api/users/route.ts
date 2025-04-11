import { type NextRequest, NextResponse } from "next/server"
import { initializeFirebaseAdmin } from "@/lib/firebase-admin-server"
import { verifyAuth, createErrorResponse } from "@/lib/api-auth"

// GET handler to list users
export async function GET(request: NextRequest) {
  // Verify admin status
  const authResult = await verifyAuth(request, true) // true = require admin

  if (!authResult.success) {
    return createErrorResponse(authResult.error, authResult.status)
  }

  try {
    const { auth, db } = initializeFirebaseAdmin()

    // Get users from Firebase Auth (limited to 1000 users)
    const listUsersResult = await auth.listUsers(1000)

    // Get additional user data from Firestore
    const usersSnapshot = await db.collection("users").get()
    const firestoreUsers = usersSnapshot.docs.reduce(
      (acc, doc) => {
        acc[doc.data().uid || ""] = {
          id: doc.id,
          ...doc.data(),
        }
        return acc
      },
      {} as Record<string, any>,
    )

    // Combine Auth and Firestore data
    const users = listUsersResult.users.map((user) => {
      const firestoreData = firestoreUsers[user.uid] || {}
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        disabled: user.disabled,
        emailVerified: user.emailVerified,
        createdAt: user.metadata.creationTime,
        lastSignIn: user.metadata.lastSignInTime,
        ...firestoreData,
      }
    })

    return NextResponse.json({ success: true, users })
  } catch (error) {
    console.error("Error in GET /api/users:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// POST handler to create a new user
export async function POST(request: NextRequest) {
  // Verify admin status
  const authResult = await verifyAuth(request, true) // true = require admin

  if (!authResult.success) {
    return createErrorResponse(authResult.error, authResult.status)
  }

  try {
    const { auth, db } = initializeFirebaseAdmin()
    const body = await request.json()

    // Validate required fields
    if (!body.email || !body.name) {
      return NextResponse.json({ success: false, error: "Email and name are required" }, { status: 400 })
    }

    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email: body.email,
      password: tempPassword,
      displayName: body.name,
    })

    // Set custom claims if user is admin
    if (body.role === "admin") {
      await auth.setCustomUserClaims(userRecord.uid, { admin: true })
    }

    // Store additional user data in Firestore
    const userDocRef = db.collection("users").doc()
    await userDocRef.set({
      uid: userRecord.uid,
      email: body.email,
      name: body.name,
      role: body.role || "user",
      createdAt: new Date(),
      lastActive: new Date(),
    })

    // Log the event
    await db.collection("events").add({
      type: "user_created",
      details: `User ${body.email} was created with role ${body.role || "user"}`,
      userId: userRecord.uid,
      timestamp: new Date(),
    })

    return NextResponse.json({
      success: true,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        name: body.name,
        role: body.role || "user",
        tempPassword,
      },
    })
  } catch (error) {
    console.error("Error in POST /api/users:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
