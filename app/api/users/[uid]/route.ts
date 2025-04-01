import { type NextRequest, NextResponse } from "next/server"
import { initializeFirebaseAdmin } from "@/lib/firebase-admin-server"

// Helper function to verify admin status (same as in users/route.ts)
async function verifyIsAdmin(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized: Missing or invalid authorization header")
  }

  const token = authHeader.split("Bearer ")[1]

  try {
    const { auth } = initializeFirebaseAdmin()
    const decodedToken = await auth.verifyIdToken(token)

    // Check if user is admin (you can customize this logic)
    const email = decodedToken.email
    if (!email || !email.includes("admin")) {
      throw new Error("Forbidden: User is not an admin")
    }

    return decodedToken
  } catch (error) {
    console.error("Error verifying admin status:", error)
    throw new Error("Unauthorized: Invalid token")
  }
}

// GET handler to get a specific user
export async function GET(request: NextRequest, { params }: { params: { uid: string } }) {
  try {
    // Verify admin status
    await verifyIsAdmin(request.headers.get("authorization"))

    const { auth, db } = initializeFirebaseAdmin()
    const uid = params.uid

    // Get user from Firebase Auth
    const userRecord = await auth.getUser(uid)

    // Get additional user data from Firestore
    const usersSnapshot = await db.collection("users").where("uid", "==", uid).get()
    let firestoreData = {}
    let firestoreId = ""

    if (!usersSnapshot.empty) {
      const doc = usersSnapshot.docs[0]
      firestoreData = doc.data()
      firestoreId = doc.id
    }

    // Combine Auth and Firestore data
    const user = {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      disabled: userRecord.disabled,
      emailVerified: userRecord.emailVerified,
      createdAt: userRecord.metadata.creationTime,
      lastSignIn: userRecord.metadata.lastSignInTime,
      firestoreId,
      ...firestoreData,
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error(`Error in GET /api/users/${params.uid}:`, error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: error instanceof Error && error.message.includes("Unauthorized") ? 401 : 500 },
    )
  }
}

// DELETE handler to delete a user
export async function DELETE(request: NextRequest, { params }: { params: { uid: string } }) {
  try {
    // Verify admin status
    await verifyIsAdmin(request.headers.get("authorization"))

    const { auth, db } = initializeFirebaseAdmin()
    const uid = params.uid

    // Delete user from Firebase Auth
    await auth.deleteUser(uid)

    // Delete user data from Firestore
    const usersSnapshot = await db.collection("users").where("uid", "==", uid).get()

    if (!usersSnapshot.empty) {
      const batch = db.batch()
      usersSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref)
      })
      await batch.commit()
    }

    // Log the event
    await db.collection("events").add({
      type: "user_deleted",
      details: `User with UID ${uid} was deleted`,
      timestamp: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error in DELETE /api/users/${params.uid}:`, error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: error instanceof Error && error.message.includes("Unauthorized") ? 401 : 500 },
    )
  }
}

// PATCH handler to update a user
export async function PATCH(request: NextRequest, { params }: { params: { uid: string } }) {
  try {
    // Verify admin status
    await verifyIsAdmin(request.headers.get("authorization"))

    const { auth, db } = initializeFirebaseAdmin()
    const uid = params.uid
    const body = await request.json()

    // Update user in Firebase Auth
    const updateAuthData: any = {}
    if (body.email) updateAuthData.email = body.email
    if (body.name) updateAuthData.displayName = body.name
    if (body.disabled !== undefined) updateAuthData.disabled = body.disabled
    if (body.password) updateAuthData.password = body.password

    await auth.updateUser(uid, updateAuthData)

    // Set custom claims if role is changing
    if (body.role) {
      await auth.setCustomUserClaims(uid, {
        admin: body.role === "admin",
      })
    }

    // Update user data in Firestore
    const usersSnapshot = await db.collection("users").where("uid", "==", uid).get()

    if (!usersSnapshot.empty) {
      const userDoc = usersSnapshot.docs[0]
      const updateData: any = {
        lastUpdated: new Date(),
      }

      if (body.name) updateData.name = body.name
      if (body.email) updateData.email = body.email
      if (body.role) updateData.role = body.role

      await userDoc.ref.update(updateData)
    }

    // Log the event
    await db.collection("events").add({
      type: "user_updated",
      details: `User with UID ${uid} was updated`,
      userId: uid,
      timestamp: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error in PATCH /api/users/${params.uid}:`, error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: error instanceof Error && error.message.includes("Unauthorized") ? 401 : 500 },
    )
  }
}

