import { NextResponse } from "next/server"
import { getAdminAuth, getAdminFirestore } from "@/lib/firebase/admin"

export async function GET() {
  try {
    // Initialize Firebase Admin
    const auth = getAdminAuth()
    const firestore = getAdminFirestore()

    // Test Firebase Admin Auth
    const userCount = (await auth.listUsers(1)).users.length

    // Test Firebase Admin Firestore
    const collections = await firestore.listCollections()
    const collectionNames = collections.map((col) => col.id)

    return NextResponse.json({
      success: true,
      message: "Firebase Admin SDK is working correctly",
      userCount,
      collections: collectionNames,
    })
  } catch (error) {
    console.error("Firebase Admin test failed:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Firebase Admin SDK test failed",
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
