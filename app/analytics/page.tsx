"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import MultiEventDashboard from "@/components/multi-event-dashboard"
import EmptyDashboardState from "@/components/empty-dashboard-state"
import SideNav from "@/components/side-nav"

export default function AnalyticsPage() {
  const router = useRouter()
  const [hasData, setHasData] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in and has data
  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/")
      return
    }

    try {
      const userData = JSON.parse(user)
      if (userData.email === "test@example.com") {
        // Test user always has data
        setHasData(true)
        setLoading(false)
        return
      }
    } catch (error) {
      console.error("Error parsing user data:", error)
    }

    // Check if user has data - for a new user, this will be false
    const userHasData = localStorage.getItem("hasData") === "true"
    setHasData(userHasData)
    setLoading(false)
  }, [router])

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
      <div className="flex-1">
        {hasData ? (
          <MultiEventDashboard />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
            <EmptyDashboardState />
            <div className="mt-8">
              <p className="text-[#d8e2ef] text-center max-w-md">
                You need to add seminar data before you can view analytics. Go to Data Management to add your first
                seminar.
              </p>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => router.push("/data-management/new")}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#2c7be5] to-[#27bcfd] text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  Add Your First Seminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

