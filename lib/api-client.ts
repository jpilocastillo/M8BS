// Client-side API utility functions for marketing events
import { mockEvents } from "@/utils/mock-data"
// Add the TEST_USER import at the top of the file
import { TEST_USER } from "@/lib/auth"

// Type definitions
export interface MarketingEvent {
  id?: string
  name: string
  date: string
  type: string
  location?: string
  budget?: number
  attendees?: number
  description?: string
  status?: string
  createdAt?: string
  updatedAt?: string
  createdBy?: string
  updatedBy?: string
  [key: string]: any // Allow for additional fields
}

// Add a helper function to check if the current user is the test user
function isTestUser() {
  if (typeof window === "undefined") return false

  const storedUser = localStorage.getItem("user")
  if (!storedUser) return false

  try {
    const user = JSON.parse(storedUser)
    return user.email === TEST_USER.email
  } catch (e) {
    return false
  }
}

// Update the fetchMarketingEvents function to use mock data for test user
export async function fetchMarketingEvents(
  options: {
    limit?: number
    sortField?: string
    sortDirection?: string
    filterStatus?: string
  } = {},
): Promise<MarketingEvent[]> {
  // If test user, return mock data
  if (isTestUser()) {
    console.log("Using mock data for test user")

    // Apply filtering if needed
    let filteredEvents = [...mockEvents]

    const { filterStatus } = options
    if (filterStatus && filterStatus !== "all") {
      filteredEvents = filteredEvents.filter((event) => event.status?.toLowerCase() === filterStatus.toLowerCase())
    }

    // Apply sorting
    const { sortField = "date", sortDirection = "desc" } = options
    filteredEvents.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return filteredEvents
  }

  // For non-test users, use the actual API
  try {
    const { limit = 100, sortField = "date", sortDirection = "desc", filterStatus } = options

    let url = `/api/marketing-events?limit=${limit}&sortBy=${sortField}&sortDirection=${sortDirection}`
    if (filterStatus && filterStatus !== "all") {
      url += `&status=${filterStatus}`
    }

    console.log("Fetching from URL:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Add credentials to ensure cookies are sent
      credentials: "include",
    })

    console.log("Response status:", response.status)

    if (!response.ok) {
      const text = await response.text()
      console.error("Error response body:", text)

      // Try to parse as JSON, but don't throw if parsing fails
      try {
        const errorData = JSON.parse(text)
        // Even if we get an error response, check if it has the events array
        if (errorData && Array.isArray(errorData.events)) {
          return errorData.events
        }
        // Otherwise throw with the error message
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      } catch (parseError) {
        // If parsing fails, throw with the status
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    }

    // For successful responses, try to parse the JSON
    const result = await response.json()

    // Check if the response has the expected events array
    if (result && Array.isArray(result.events)) {
      return result.events
    } else if (Array.isArray(result)) {
      // Direct array response (fallback)
      return result
    } else {
      console.error("Unexpected response format:", result)
      return []
    }
  } catch (error) {
    console.error("Error fetching marketing events:", error)
    // Return empty array instead of throwing to prevent UI crashes
    return []
  }
}

// Fetch a single marketing event by ID
export async function fetchMarketingEvent(id: string): Promise<MarketingEvent> {
  // If test user, return mock data
  if (isTestUser()) {
    console.log("Using mock data for test user - single event")
    const event = mockEvents.find((event) => event.id === id)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    if (event) {
      return event
    } else {
      throw new Error("Event not found")
    }
  }

  // For non-test users, use the actual API
  try {
    const response = await fetch(`/api/marketing-events/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })

    if (!response.ok) {
      const text = await response.text()
      try {
        const errorData = JSON.parse(text)
        throw new Error(errorData.error || "Failed to fetch marketing event")
      } catch (parseError) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching marketing event ${id}:`, error)
    throw error
  }
}

// Create a new marketing event
export async function createMarketingEvent(eventData: Omit<MarketingEvent, "id" | "roi">): Promise<MarketingEvent> {
  // If test user, simulate creating an event with mock data
  if (isTestUser()) {
    console.log("Using mock data for test user - create event")

    // Create a new mock event with the provided data
    const newEvent = {
      ...eventData,
      id: `mock-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return newEvent
  }

  // For non-test users, use the actual API
  try {
    const response = await fetch("/api/marketing-events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(eventData),
    })

    if (!response.ok) {
      const text = await response.text()
      try {
        const errorData = JSON.parse(text)
        throw new Error(errorData.error || "Failed to create marketing event")
      } catch (parseError) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating marketing event:", error)
    throw error
  }
}

// Update an existing marketing event
export async function updateMarketingEvent(id: string, eventData: Partial<MarketingEvent>): Promise<MarketingEvent> {
  // If test user, simulate updating an event with mock data
  if (isTestUser()) {
    console.log("Using mock data for test user - update event")

    // Find the event to update
    const eventIndex = mockEvents.findIndex((event) => event.id === id)

    if (eventIndex === -1) {
      throw new Error("Event not found")
    }

    // Create updated event
    const updatedEvent = {
      ...mockEvents[eventIndex],
      ...eventData,
      updatedAt: new Date().toISOString(),
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 400))

    return updatedEvent
  }

  // For non-test users, use the actual API
  try {
    const response = await fetch(`/api/marketing-events/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(eventData),
    })

    if (!response.ok) {
      const text = await response.text()
      try {
        const errorData = JSON.parse(text)
        throw new Error(errorData.error || "Failed to update marketing event")
      } catch (parseError) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    }

    return await response.json()
  } catch (error) {
    console.error(`Error updating marketing event ${id}:`, error)
    throw error
  }
}

// Delete a marketing event
export async function deleteMarketingEvent(id: string): Promise<{ success: boolean; id: string }> {
  // If test user, simulate deleting an event
  if (isTestUser()) {
    console.log("Using mock data for test user - delete event")

    // Check if event exists
    const eventExists = mockEvents.some((event) => event.id === id)

    if (!eventExists) {
      throw new Error("Event not found")
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return { success: true, id }
  }

  // For non-test users, use the actual API
  try {
    const response = await fetch(`/api/marketing-events/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })

    if (!response.ok) {
      const text = await response.text()
      try {
        const errorData = JSON.parse(text)
        throw new Error(errorData.error || "Failed to delete marketing event")
      } catch (parseError) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    }

    return await response.json()
  } catch (error) {
    console.error(`Error deleting marketing event ${id}:`, error)
    throw error
  }
}
