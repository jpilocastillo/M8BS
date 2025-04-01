import { type NextRequest, NextResponse } from "next/server"
import { initializeFirebaseAdmin } from "@/lib/firebase-admin-server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

// GET handler to fetch all marketing events
export async function GET(request: NextRequest) {
  try {
    console.log("API: GET /api/marketing-events called")

    // Check authentication
    const session = await getServerSession(authOptions)
    console.log("Session:", session ? "Authenticated" : "Not authenticated")

    if (!session) {
      console.log("API: Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized", events: [] }, { status: 401 })
    }

    // Initialize Firebase Admin
    console.log("API: Initializing Firebase Admin")
    const { db } = initializeFirebaseAdmin()

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 100
    const sortBy = searchParams.get("sortBy") || "date"
    const sortDirection = searchParams.get("sortDirection") || "desc"
    const status = searchParams.get("status")

    console.log("API: Query params:", { limit, sortBy, sortDirection, status })

    // Build query
    let query = db.collection("marketingEvents").limit(limit)

    // Add status filter if provided
    if (status && status !== "all") {
      query = query.where("status", "==", status)
    }

    // Execute query
    console.log("API: Executing Firestore query")
    const snapshot = await query.get()

    // Format response
    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    console.log(`API: Found ${events.length} events`)

    // Sort results (since Firestore might not support all sorting options)
    if (sortBy) {
      events.sort((a, b) => {
        const aValue = a[sortBy]
        const bValue = b[sortBy]

        // Handle different data types
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
        } else {
          // For numbers, dates, etc.
          return sortDirection === "asc" ? (aValue > bValue ? 1 : -1) : aValue < bValue ? 1 : -1
        }
      })
    }

    // Return with proper headers
    return NextResponse.json(
      { events },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
        },
      },
    )
  } catch (error: any) {
    console.error("Error fetching marketing events:", error)
    // Always return a valid JSON object with an empty events array
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch marketing events",
        events: [],
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
        },
      },
    )
  }
}

// POST handler to create a new marketing event
export async function POST(request: NextRequest) {
  try {
    console.log("API: POST /api/marketing-events called")

    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      console.log("API: Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const data = await request.json()
    console.log("API: Received data:", data)

    // Validate required fields
    if (!data.name || !data.date || !data.type) {
      console.log("API: Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Initialize Firebase Admin
    console.log("API: Initializing Firebase Admin")
    const { db } = initializeFirebaseAdmin()

    // Add timestamp
    const eventData = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: session.user?.email || "unknown",
    }

    // Add to Firestore
    console.log("API: Adding document to Firestore")
    const docRef = await db.collection("marketingEvents").add(eventData)
    console.log("API: Document added with ID:", docRef.id)

    return NextResponse.json(
      {
        id: docRef.id,
        ...eventData,
      },
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
        },
      },
    )
  } catch (error: any) {
    console.error("Error creating marketing event:", error)
    return NextResponse.json(
      { error: "Failed to create marketing event" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
        },
      },
    )
  }
}

