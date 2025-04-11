import { type NextRequest, NextResponse } from "next/server"
import { initializeFirebaseAdmin } from "@/lib/firebase-admin-server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

// GET handler to fetch a specific marketing event
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    // Initialize Firebase Admin
    const { db } = initializeFirebaseAdmin()

    // Get document from Firestore
    const docRef = db.collection("marketingEvents").doc(id)
    const doc = await docRef.get()

    // Check if document exists
    if (!doc.exists) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Return the document data
    return NextResponse.json({
      id: doc.id,
      ...doc.data(),
    })
  } catch (error: any) {
    console.error(`Error fetching marketing event ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch marketing event" }, { status: 500 })
  }
}

// PUT handler to update a specific marketing event
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    // Parse request body
    const data = await request.json()

    // Initialize Firebase Admin
    const { db } = initializeFirebaseAdmin()

    // Get document reference
    const docRef = db.collection("marketingEvents").doc(id)

    // Check if document exists
    const doc = await docRef.get()
    if (!doc.exists) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Update the document
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
      updatedBy: session.user?.email || "unknown",
    }

    await docRef.update(updateData)

    // Return the updated data
    return NextResponse.json({
      id,
      ...updateData,
    })
  } catch (error: any) {
    console.error(`Error updating marketing event ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update marketing event" }, { status: 500 })
  }
}

// DELETE handler to remove a specific marketing event
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    // Initialize Firebase Admin
    const { db } = initializeFirebaseAdmin()

    // Get document reference
    const docRef = db.collection("marketingEvents").doc(id)

    // Check if document exists
    const doc = await docRef.get()
    if (!doc.exists) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Delete the document
    await docRef.delete()

    // Return success response
    return NextResponse.json({ success: true, id })
  } catch (error: any) {
    console.error(`Error deleting marketing event ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete marketing event" }, { status: 500 })
  }
}
