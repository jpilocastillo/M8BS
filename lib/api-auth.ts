import { type NextRequest, NextResponse } from "next/server"
import { initializeFirebaseAdmin } from "./firebase-admin-server"

// Types for the verification result
export type VerifiedRequest = {
  uid: string
  email: string
  admin: boolean
  [key: string]: any
}

export type VerificationResult =
  | { success: true; user: VerifiedRequest }
  | { success: false; error: string; status: number }

/**
 * Verifies if the request is from an authenticated user
 * @param request The Next.js request object
 * @param requireAdmin Whether to require admin privileges
 * @returns The verification result with user data or error
 */
export async function verifyAuth(request: NextRequest, requireAdmin = false): Promise<VerificationResult> {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        success: false,
        error: "Unauthorized: Missing or invalid authorization header",
        status: 401,
      }
    }

    const token = authHeader.split("Bearer ")[1]
    const { auth } = initializeFirebaseAdmin()

    try {
      const decodedToken = await auth.verifyIdToken(token)

      // Check if admin is required but user is not an admin
      if (requireAdmin && !decodedToken.admin) {
        return {
          success: false,
          error: "Forbidden: Admin privileges required",
          status: 403,
        }
      }

      return {
        success: true,
        user: {
          uid: decodedToken.uid,
          email: decodedToken.email || "",
          admin: !!decodedToken.admin,
          ...decodedToken,
        },
      }
    } catch (error) {
      console.error("Token verification error:", error)
      return {
        success: false,
        error: "Unauthorized: Invalid token",
        status: 401,
      }
    }
  } catch (error) {
    console.error("Auth verification error:", error)
    return {
      success: false,
      error: "Internal server error during authentication",
      status: 500,
    }
  }
}

/**
 * Helper function to create an error response
 */
export function createErrorResponse(error: string, status: number) {
  return NextResponse.json({ success: false, error }, { status })
}
