"use client"

import { useState, useEffect } from "react"
import { BarChart2, FileText } from "lucide-react"
import EventHeatmap from "./analytics/event-heat-map"
import TopPerformers from "./analytics/top-performers"
import AggregateMetrics from "./analytics/aggregate-metrics"
import EventFilterBar from "./analytics/event-filter-bar"
// Import the EmptyDashboardState component at the top of the file
import EmptyDashboardState from "./empty-dashboard-state"
// Add import for mock data at the top of the file
import { mockEvents } from "@/utils/mock-data"
import { useRouter } from "next/navigation"
import { convertToCSV, formatEventDataForExport, downloadCSV } from "@/utils/export-utils"

// Sample data for multiple events
const multiEventData = [
  {
    id: "evt-001",
    date: "2023-12-15",
    location: "Vino Grille",
    topic: "Retirement Outlook",
    roi: 274,
    conversionRate: 7.1,
    attendees: 28,
    clients: 2,
    revenue: 258991,
    expenses: 7872.02,
  },
  {
    id: "evt-002",
    date: "2023-11-30",
    location: "Parkside Hotel",
    topic: "Tax Strategies",
    roi: 245,
    conversionRate: 6.5,
    attendees: 31,
    clients: 2,
    revenue: 210000,
    expenses: 7100,
  },
  {
    id: "evt-003",
    date: "2023-10-20",
    location: "Grand Conference Center",
    topic: "Estate Planning",
    roi: 198,
    conversionRate: 4.8,
    attendees: 21,
    clients: 1,
    revenue: 150000,
    expenses: 6700,
  },
  {
    id: "evt-004",
    date: "2023-09-15",
    location: "Lakeview Restaurant",
    topic: "Social Security",
    roi: 310,
    conversionRate: 8.1,
    attendees: 37,
    clients: 3,
    revenue: 280000,
    expenses: 7700,
  },
  {
    id: "evt-005",
    date: "2024-01-20",
    location: "Downtown Conference Hall",
    roi: 265,
    conversionRate: 7.4,
    attendees: 27,
    clients: 2,
    revenue: 230000,
    expenses: 7300,
    topic: "Retirement Outlook",
  },
  {
    id: "evt-006",
    date: "2023-08-05",
    location: "Seaside Restaurant",
    roi: 285,
    conversionRate: 7.7,
    attendees: 26,
    clients: 2,
    revenue: 240000,
    expenses: 7500,
    topic: "Retirement Outlook",
  },
  {
    id: "evt-007",
    date: "2023-07-12",
    location: "Mountain View Hotel",
    roi: 225,
    conversionRate: 5.5,
    attendees: 18,
    clients: 1,
    revenue: 190000,
    expenses: 6500,
    topic: "Tax Strategies",
  },
  {
    id: "evt-008",
    date: "2023-06-28",
    location: "Riverside Conference Center",
    roi: 250,
    conversionRate: 6.8,
    attendees: 29,
    clients: 2,
    revenue: 220000,
    expenses: 7000,
    topic: "Estate Planning",
  },
  {
    id: "evt-009",
    date: "2023-05-17",
    location: "City Center Venue",
    roi: 274,
    conversionRate: 7.1,
    attendees: 28,
    clients: 2,
    revenue: 258991,
    expenses: 7872.02,
    topic: "Social Security",
  },
]

export default function MultiEventDashboard() {
  const [filteredEvents, setFilteredEvents] = useState(multiEventData)
  const [dateRange, setDateRange] = useState({ start: "2023-01-01", end: "2024-12-31" })
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [isExporting, setIsExporting] = useState(false)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Apply filters when they change
  useEffect(() => {
    let filtered = [...multiEventData]

    // Filter by date range
    filtered = filtered.filter((event) => event.date >= dateRange.start && event.date <= dateRange.end)

    // Filter by topics if any are selected
    if (selectedTopics.length > 0) {
      filtered = filtered.filter((event) => selectedTopics.includes(event.topic))
    }

    // Filter by locations if any are selected
    if (selectedLocations.length > 0) {
      filtered = filtered.filter((event) => selectedLocations.includes(event.location))
    }

    setFilteredEvents(filtered)
  }, [dateRange, selectedTopics, selectedLocations])

  // Get unique topics and locations for filters
  const topics = [...new Set(multiEventData.map((event) => event.topic))]
  const locations = [...new Set(multiEventData.map((event) => event.location))]

  // Handle export
  const handleExportCSV = () => {
    setIsExporting(true)
    // Simulate export delay
    setTimeout(() => {
      setIsExporting(false)
      alert("Analytics data exported successfully!")
    }, 1500)
  }

  // Update the useEffect to check for test user and load mock data
  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/")
      return
    }

    // Check if this is the test user
    try {
      const userData = JSON.parse(user)
      if (userData.email === "test@example.com") {
        // Load mock data for test user
        setEvents(mockEvents)
      } else {
        // Check if user has data - for a new user, this will be false
        const userHasData = localStorage.getItem("hasData") === "true"

        // If user has data, load their events (in a real app, this would come from a database here)
        if (userHasData) {
          // In a real app, you would fetch the user's events from a database here
          // For now, we'll just set an empty array
          setEvents([])
        }
      }
    } catch (error) {
      console.error("Error parsing user data:", error)
    }

    setLoading(false)
  }, [router])

  const handleExportToCSV = () => {
    // Get the filtered events based on current filters
    const eventsToExport = filteredEvents || mockEvents

    // Format the data for export
    const formattedData = eventsToExport.map((event) => formatEventDataForExport(event))

    // Convert to CSV
    const csvContent = convertToCSV(formattedData)

    // Download the CSV file
    downloadCSV(csvContent, `marketing-events-export-${new Date().toISOString().split("T")[0]}.csv`)
  }

  return (
    <div className="w-full">
      <main className="flex-1 p-6">
        {multiEventData.length === 0 ? (
          <EmptyDashboardState />
        ) : (
          <>
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <BarChart2 className="h-6 w-6 text-[#2c7be5]" />
                <h1 className="text-3xl font-bold text-white">
                  Multi-Event
                  <br />
                  <span className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
                    Analytics Dashboard
                  </span>
                </h1>
              </div>
              <button
                onClick={handleExportToCSV}
                className="flex items-center gap-2 rounded-lg bg-[#050117]/50 px-4 py-2 text-sm font-medium text-white hover:bg-[#050117]/70 border border-[#215cac]/30"
              >
                <FileText className="h-4 w-4" />
                Export to CSV
              </button>
            </div>

            {/* Filter Bar */}
            <EventFilterBar
              topics={topics}
              locations={locations}
              dateRange={dateRange}
              setDateRange={setDateRange}
              selectedTopics={selectedTopics}
              setSelectedTopics={setSelectedTopics}
              selectedLocations={selectedLocations}
              setSelectedLocations={setSelectedLocations}
            />

            {/* Aggregate Metrics */}
            <AggregateMetrics events={filteredEvents} />

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Top Performers */}
              <TopPerformers events={filteredEvents} />

              {/* Event Heatmap */}
              <EventHeatmap events={filteredEvents} />
            </div>
          </>
        )}
      </main>
    </div>
  )
}

