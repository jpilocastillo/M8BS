import { type NextRequest, NextResponse } from "next/server"
import { initializeFirebaseAdmin } from "@/lib/firebase-admin-server"
import { verifyAuth, createErrorResponse } from "@/lib/api-auth"

export async function POST(request: NextRequest) {
  // Verify admin status - only admins can set admin claims
  const authResult = await verifyAuth(request, true)

  if (!authResult.success) {
    return createErrorResponse(authResult.error, authResult.status)
  }

  try {
    const { auth } = initializeFirebaseAdmin()
    const body = await request.json()

    // Validate required fields
    if (!body.uid) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 })
    }

    const isAdmin = body.isAdmin !== false // Default to true if not specified

    // Set the admin claim
    await auth.setCustomUserClaims(body.uid, { admin: isAdmin })

    // Get the updated user
    const userRecord = await auth.getUser(body.uid)

    return NextResponse.json({
      success: true,
      message: `Admin claim ${isAdmin ? "granted" : "revoked"} for user ${body.uid}`,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        admin: isAdmin,
      },
    })
  } catch (error) {
    console.error("Error setting admin claim:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
