import { initializeFirebaseAdmin } from "../lib/firebase-admin-server"
import { mockEvents } from "../utils/mock-data"

async function seedDatabase() {
  try {
    console.log("Starting database seeding...")

    // Initialize Firebase Admin
    const { db } = initializeFirebaseAdmin()

    // Check if data already exists
    const existingEvents = await db.collection("marketingEvents").limit(1).get()

    if (!existingEvents.empty) {
      console.log("Database already contains marketing events. Skipping seed.")
      return
    }

    console.log(`Seeding ${mockEvents.length} marketing events...`)

    // Add each mock event to Firestore
    const batch = db.batch()

    mockEvents.forEach((event) => {
      // Remove the id property as Firestore will generate one
      const { id, ...eventData } = event

      // Add metadata
      const enrichedData = {
        ...eventData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "system",
      }

      // Add to batch
      const docRef = db.collection("marketingEvents").doc()
      batch.set(docRef, enrichedData)
    })

    // Commit the batch
    await batch.commit()

    console.log("Database seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}

// Execute if this file is run directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Fatal error during seeding:", error)
      process.exit(1)
    })
}

export { seedDatabase }
