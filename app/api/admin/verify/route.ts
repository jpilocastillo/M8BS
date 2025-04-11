import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth, createErrorResponse } from "@/lib/api-auth"

export async function GET(request: NextRequest) {
  const authResult = await verifyAuth(request, false) // Don't require admin yet

  if (!authResult.success) {
    return createErrorResponse(authResult.error, authResult.status)
  }

  // Check if the user is an admin
  const isAdmin = authResult.user.admin === true

  return NextResponse.json({
    success: true,
    isAdmin,
    user: {
      uid: authResult.user.uid,
      email: authResult.user.email,
      admin: isAdmin,
    },
  })
}
