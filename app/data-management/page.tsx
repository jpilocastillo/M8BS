"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, FileSpreadsheet, Plus, Search, Filter, ChevronDown, Calendar } from "lucide-react"
import SideNav from "@/components/side-nav"
import { fetchMarketingEvents, deleteMarketingEvent } from "@/lib/api-client"
import { getCurrentUser } from "@/lib/auth"
import { TEST_USER } from "@/utils/mock-data"

export default function DataManagementPage() {
  const router = useRouter()
  const [events, setEvents] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState("all")
  const eventsPerPage = 10
  const [isExporting, setIsExporting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isTestUser, setIsTestUser] = useState(false)

  // Check if current user is test user
  useEffect(() => {
    const currentUser = getCurrentUser()
    setIsTestUser(currentUser?.email === TEST_USER.email)
  }, [])

  // Load events from API
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchMarketingEvents({
          sortField,
          sortDirection,
          filterStatus,
        })

        // Check if data is an array
        if (Array.isArray(data)) {
          setEvents(data)

          // Show a message if no events were found
          if (data.length === 0) {
            setError("No events found. You can add new events using the 'New Event' button.")
          } else {
            setError(null)
          }
        } else {
          // This case should not happen with our updated code, but just in case
          console.error("Unexpected data format:", data)
          setEvents([])
          setError("Failed to load events due to an unexpected data format.")
        }
      } catch (err: any) {
        console.error("Failed to load events:", err)
        setError(err?.message || "Failed to load events. Please try again later.")
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [sortField, sortDirection, filterStatus])

  // Filter events based on search term
  const filteredEvents = events.filter((event) => {
    if (!searchTerm) return true

    // Apply search filter to all text fields
    return Object.values(event).some(
      (value) => typeof value === "string" && value.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  })

  // Pagination
  const indexOfLastEvent = currentPage * eventsPerPage
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent)
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage)

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (e) {
      return dateString || "N/A"
    }
  }

  // Format currency for display
  const formatCurrency = (value) => {
    if (!value && value !== 0) return "N/A"
    return `$${Number(value).toLocaleString()}`
  }

  // Handle sort click
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  // Handle edit event
  const handleEditEvent = (eventId) => {
    router.push(`/data-management/edit/${eventId}`)
  }

  // Handle view event
  const handleViewEvent = (eventId) => {
    router.push(`/dashboard?event=${eventId}`)
  }

  // Handle delete event
  const handleDeleteEvent = async (eventId) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteMarketingEvent(eventId)
        // Remove from local state
        setEvents(events.filter((event) => event.id !== eventId))
      } catch (err) {
        console.error("Failed to delete event:", err)
        alert("Failed to delete event. Please try again.")
      }
    }
  }

  // Handle export CSV
  const handleExportCSV = () => {
    setIsExporting(true)
    // Simulate export delay
    setTimeout(() => {
      setIsExporting(false)
      alert("CSV export completed!")
    }, 1500)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#050117] to-[#0a0a29] text-white items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-[#2c7be5] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="mt-2">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#050117] to-[#0a0a29] text-white">
      <SideNav />
      <main className="flex-1 p-6">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-[#5e6e82] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-white">
            Data Management
            <br />
            <span className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
              Marketing Events
            </span>
          </h1>

          {isTestUser && (
            <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-md text-sm">Using test user data</div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/data-management/new"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#2c7be5] to-[#27bcfd] text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Plus className="h-5 w-5" />
              <span>New Event</span>
            </Link>
            <button
              onClick={handleExportCSV}
              disabled={isExporting || filteredEvents.length === 0}
              className="px-4 py-2 rounded-lg bg-[#215cac]/20 text-white font-bold flex items-center justify-center gap-2 hover:bg-[#215cac]/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FileSpreadsheet className="h-5 w-5" />
              )}
              <span>Export as CSV</span>
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#5e6e82]" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white"
            />
          </div>

          <div className="relative">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md text-white"
              onClick={() => document.getElementById("statusDropdown").classList.toggle("hidden")}
            >
              <Filter className="h-5 w-5 text-[#5e6e82]" />
              <span>Status: {filterStatus === "all" ? "All" : filterStatus}</span>
              <ChevronDown className="h-4 w-4 text-[#5e6e82]" />
            </button>

            <div
              id="statusDropdown"
              className="absolute right-0 mt-2 w-48 bg-[#0a0a29] border border-[#215cac]/40 rounded-md shadow-lg z-10 hidden"
            >
              <button
                className={`block w-full text-left px-4 py-2 hover:bg-[#215cac]/20 ${
                  filterStatus === "all" ? "bg-[#215cac]/20 text-white" : "text-[#5e6e82]"
                }`}
                onClick={() => {
                  setFilterStatus("all")
                  document.getElementById("statusDropdown").classList.add("hidden")
                }}
              >
                All Events
              </button>
              <button
                className={`block w-full text-left px-4 py-2 hover:bg-[#215cac]/20 ${
                  filterStatus === "completed" ? "bg-[#215cac]/20 text-white" : "text-[#5e6e82]"
                }`}
                onClick={() => {
                  setFilterStatus("completed")
                  document.getElementById("statusDropdown").classList.add("hidden")
                }}
              >
                Completed
              </button>
              <button
                className={`block w-full text-left px-4 py-2 hover:bg-[#215cac]/20 ${
                  filterStatus === "planned" ? "bg-[#215cac]/20 text-white" : "text-[#5e6e82]"
                }`}
                onClick={() => {
                  setFilterStatus("planned")
                  document.getElementById("statusDropdown").classList.add("hidden")
                }}
              >
                Planned
              </button>
              <button
                className={`block w-full text-left px-4 py-2 hover:bg-[#215cac]/20 ${
                  filterStatus === "in-progress" ? "bg-[#215cac]/20 text-white" : "text-[#5e6e82]"
                }`}
                onClick={() => {
                  setFilterStatus("in-progress")
                  document.getElementById("statusDropdown").classList.add("hidden")
                }}
              >
                In Progress
              </button>
              <button
                className={`block w-full text-left px-4 py-2 hover:bg-[#215cac]/20 ${
                  filterStatus === "cancelled" ? "bg-[#215cac]/20 text-white" : "text-[#5e6e82]"
                }`}
                onClick={() => {
                  setFilterStatus("cancelled")
                  document.getElementById("statusDropdown").classList.add("hidden")
                }}
              >
                Cancelled
              </button>
            </div>
          </div>
        </div>

        {/* Error message if any */}
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-md">
            <p className="font-medium">Error: {error}</p>
            <p className="text-sm mt-1">Try refreshing the page or check your connection.</p>
          </div>
        )}

        {/* Table of events */}
        {events.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#215cac]/20">
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#d8e2ef]">
                    <button className="flex items-center gap-1" onClick={() => handleSort("date")}>
                      Date
                      {sortField === "date" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#d8e2ef]">
                    <button className="flex items-center gap-1" onClick={() => handleSort("name")}>
                      Name
                      {sortField === "name" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#d8e2ef]">
                    <button className="flex items-center gap-1" onClick={() => handleSort("location")}>
                      Location
                      {sortField === "location" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#d8e2ef]">
                    <button className="flex items-center gap-1" onClick={() => handleSort("type")}>
                      Type
                      {sortField === "type" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#d8e2ef]">
                    <button className="flex items-center gap-1" onClick={() => handleSort("budget")}>
                      Budget
                      {sortField === "budget" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#d8e2ef]">
                    <button className="flex items-center gap-1" onClick={() => handleSort("status")}>
                      Status
                      {sortField === "status" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-[#d8e2ef]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentEvents.map((event) => (
                  <tr key={event.id} className="border-b border-[#215cac]/20 hover:bg-[#215cac]/10 transition-colors">
                    <td className="px-4 py-3 text-sm text-white">{formatDate(event.date)}</td>
                    <td className="px-4 py-3 text-sm text-white">{event.name || event.topic}</td>
                    <td className="px-4 py-3 text-sm text-white">{event.location || "N/A"}</td>
                    <td className="px-4 py-3 text-sm text-white">{event.type || event.typeOfMarketing || "N/A"}</td>
                    <td className="px-4 py-3 text-sm text-white">
                      {formatCurrency(event.budget || event.advertisingCost)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          event.status === "completed" || event.status === "complete"
                            ? "bg-[#00d27a]/20 text-[#00d27a]"
                            : event.status === "in-progress"
                              ? "bg-[#2c7be5]/20 text-[#2c7be5]"
                              : event.status === "planned"
                                ? "bg-[#f5803e]/20 text-[#f5803e]"
                                : "bg-[#e63757]/20 text-[#e63757]"
                        }`}
                      >
                        {event.status || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleViewEvent(event.id)}
                          className="px-2 py-1 rounded bg-[#215cac]/20 text-[#2c7be5] hover:bg-[#215cac]/30 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditEvent(event.id)}
                          className="px-2 py-1 rounded bg-[#215cac]/20 text-[#2c7be5] hover:bg-[#215cac]/30 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="px-2 py-1 rounded bg-[#e63757]/20 text-[#e63757] hover:bg-[#e63757]/30 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#215cac]/10 mb-4">
              <Calendar className="h-8 w-8 text-[#2c7be5]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
            <p className="text-[#5e6e82] max-w-md mx-auto">
              You haven't added any marketing events yet. Add your first event to get started.
            </p>
            <div className="mt-6">
              <Link
                href="/data-management/new"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#2c7be5] to-[#27bcfd] text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mx-auto w-fit"
              >
                <Plus className="h-5 w-5" />
                <span>Add Your First Event</span>
              </Link>
            </div>
          </div>
        )}

        {/* Pagination */}
        {filteredEvents.length > eventsPerPage && (
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-[#215cac]/20 text-[#2c7be5] hover:bg-[#215cac]/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? "bg-[#2c7be5] text-white"
                      : "bg-[#215cac]/20 text-[#2c7be5] hover:bg-[#215cac]/30"
                  } transition-colors`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-[#215cac]/20 text-[#2c7be5] hover:bg-[#215cac]/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

