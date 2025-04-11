"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, BarChart2, Calendar, ChevronDown, Filter, Search } from "lucide-react"
import SideNav from "@/components/side-nav"
import MultiEventDashboard from "@/components/multi-event-dashboard"
import { mockEvents } from "@/utils/mock-data" // Import the existing mock data

export default function MarketingDataPage() {
  const router = useRouter()
  const [events, setEvents] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")
  const [filterTopic, setFilterTopic] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/")
      return
    }

    // Load mock data from the existing test user data
    setEvents(mockEvents)
    setLoading(false)
  }, [router])

  // Filter and sort events
  const filteredEvents = events.filter((event) => {
    // Apply search filter
    const matchesSearch =
      event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.date?.includes(searchTerm)

    // Apply topic filter
    const matchesTopic = filterTopic === "all" || event.topicOfMarketing === filterTopic

    return matchesSearch && matchesTopic
  })

  // Sort events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortField === "date") {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA
    } else if (
      sortField === "revenue" ||
      sortField === "expenses" ||
      sortField === "roi" ||
      sortField === "attendees" ||
      sortField === "clients"
    ) {
      // Handle numeric fields
      const valueA =
        sortField === "expenses"
          ? Number.parseFloat(a.advertisingCost) + Number.parseFloat(a.foodVenueCost)
          : sortField === "revenue"
            ? a.revenue
            : sortField === "attendees"
              ? Number.parseInt(a.attendees)
              : sortField === "clients"
                ? Number.parseInt(a.clients)
                : a.roi
      const valueB =
        sortField === "expenses"
          ? Number.parseFloat(b.advertisingCost) + Number.parseFloat(b.foodVenueCost)
          : sortField === "revenue"
            ? b.revenue
            : sortField === "attendees"
              ? Number.parseInt(b.attendees)
              : sortField === "clients"
                ? Number.parseInt(b.clients)
                : b.roi
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA
    } else {
      // Default to string comparison for other fields
      const valueA = a[sortField]?.toString().toLowerCase() || ""
      const valueB = b[sortField]?.toString().toLowerCase() || ""
      return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
    }
  })

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Format currency for display
  const formatCurrency = (value) => {
    return `$${Number.parseFloat(value).toLocaleString()}`
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

  // Get unique topics for filter
  const uniqueTopics = [...new Set(events.map((event) => event.topicOfMarketing))]

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#050117] to-[#0a0a29] text-white items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-[#2c7be5] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#5e6e82]">Loading...</p>
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
          <div className="flex items-center gap-3">
            <BarChart2 className="h-6 w-6 text-[#2c7be5]" />
            <h1 className="text-3xl font-bold text-white">
              Marketing Data
              <br />
              <span className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
                View All Events
              </span>
            </h1>
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
              onClick={() => document.getElementById("topicDropdown").classList.toggle("hidden")}
            >
              <Filter className="h-5 w-5 text-[#5e6e82]" />
              <span>Topic: {filterTopic === "all" ? "All" : filterTopic}</span>
              <ChevronDown className="h-4 w-4 text-[#5e6e82]" />
            </button>

            <div
              id="topicDropdown"
              className="absolute right-0 mt-2 w-48 bg-[#0a0a29] border border-[#215cac]/40 rounded-md shadow-lg z-10 hidden"
            >
              <button
                className={`block w-full text-left px-4 py-2 hover:bg-[#215cac]/20 ${
                  filterTopic === "all" ? "bg-[#215cac]/20 text-white" : "text-[#5e6e82]"
                }`}
                onClick={() => {
                  setFilterTopic("all")
                  document.getElementById("topicDropdown").classList.add("hidden")
                }}
              >
                All Topics
              </button>
              {uniqueTopics.map((topic) => (
                <button
                  key={topic}
                  className={`block w-full text-left px-4 py-2 hover:bg-[#215cac]/20 ${
                    filterTopic === topic ? "bg-[#215cac]/20 text-white" : "text-[#5e6e82]"
                  }`}
                  onClick={() => {
                    setFilterTopic(topic)
                    document.getElementById("topicDropdown").classList.add("hidden")
                  }}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Events Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#215cac]/40">
                <th
                  className="px-4 py-3 text-left text-sm font-semibold text-[#d8e2ef] cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center gap-1">
                    <span>Date</span>
                    {sortField === "date" && (
                      <span className="text-[#2c7be5]">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold text-[#d8e2ef] cursor-pointer"
                  onClick={() => handleSort("location")}
                >
                  <div className="flex items-center gap-1">
                    <span>Location</span>
                    {sortField === "location" && (
                      <span className="text-[#2c7be5]">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold text-[#d8e2ef] cursor-pointer"
                  onClick={() => handleSort("topicOfMarketing")}
                >
                  <div className="flex items-center gap-1">
                    <span>Topic</span>
                    {sortField === "topicOfMarketing" && (
                      <span className="text-[#2c7be5]">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-right text-sm font-semibold text-[#d8e2ef] cursor-pointer"
                  onClick={() => handleSort("attendees")}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Attendees</span>
                    {sortField === "attendees" && (
                      <span className="text-[#2c7be5]">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-right text-sm font-semibold text-[#d8e2ef] cursor-pointer"
                  onClick={() => handleSort("clients")}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Clients</span>
                    {sortField === "clients" && (
                      <span className="text-[#2c7be5]">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-right text-sm font-semibold text-[#d8e2ef] cursor-pointer"
                  onClick={() => handleSort("revenue")}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Revenue</span>
                    {sortField === "revenue" && (
                      <span className="text-[#2c7be5]">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-right text-sm font-semibold text-[#d8e2ef] cursor-pointer"
                  onClick={() => handleSort("roi")}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>ROI</span>
                    {sortField === "roi" && (
                      <span className="text-[#2c7be5]">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-[#d8e2ef]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedEvents.length > 0 ? (
                sortedEvents.map((event) => (
                  <tr key={event.id} className="border-b border-[#215cac]/20 hover:bg-[#215cac]/10 transition-colors">
                    <td className="px-4 py-3 text-sm text-white">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#2c7be5]" />
                        {formatDate(event.date)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-white">{event.location}</td>
                    <td className="px-4 py-3 text-sm text-white">{event.topicOfMarketing}</td>
                    <td className="px-4 py-3 text-sm text-white text-right">{event.attendees}</td>
                    <td className="px-4 py-3 text-sm text-white text-right">{event.clientsFromEvent}</td>
                    <td className="px-4 py-3 text-sm text-white text-right">{formatCurrency(event.revenue)}</td>
                    <td className="px-4 py-3 text-sm text-white text-right">{event.roi}%</td>
                    <td className="px-4 py-3 text-sm text-right">
                      <Link
                        href={`/dashboard?date=${event.id}`}
                        className="px-3 py-1 rounded bg-[#215cac]/30 text-[#2c7be5] hover:bg-[#215cac]/50 transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-[#5e6e82]">
                    No events found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Analytics Dashboard */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-white mb-6">Analytics Overview</h2>
          <MultiEventDashboard events={sortedEvents} />
        </div>
      </main>
    </div>
  )
}
