"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BarChart3, Users, Shield } from "lucide-react"
import Link from "next/link"
import AdminLayout from "@/components/admin/admin-layout"
import { initializeFirebase } from "@/lib/firebase"
import { collection, getDocs, query, orderBy, limit, where, Timestamp } from "firebase/firestore"
import { getAuth, onAuthStateChanged, User as FirebaseUser } from "firebase/auth"

interface User {
  id: string
  name?: string
  email: string
  lastActive?: Timestamp | string
  lastLogin?: Timestamp
}

interface AdminStats {
  totalUsers: number
  activeSessions: number
  systemEvents: number
  recentUsers: User[]
  isLoading: boolean
  error: string | null
  usingMockData: boolean
}

const MOCK_DATA = {
  totalUsers: 3,
  activeSessions: 1,
  systemEvents: 5,
  recentUsers: [
    {
      id: "mock-1",
      name: "Admin User",
      email: "admin@example.com",
      lastActive: "Just now",
    },
    {
      id: "mock-2",
      name: "John Doe",
      email: "john@example.com",
      lastActive: "5 minutes ago",
    },
    {
      id: "mock-3",
      name: "Jane Smith",
      email: "jane@example.com",
      lastActive: "1 hour ago",
    },
  ],
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeSessions: 0,
    systemEvents: 0,
    recentUsers: [],
    isLoading: true,
    error: null,
    usingMockData: false,
  })

  const router = useRouter()

  useEffect(() => {
    const authCheck = async () => {
      const { app } = await initializeFirebase()
      const auth = getAuth(app)

      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          router.push("/admin/login")
          return
        }

        const idToken = await user.getIdTokenResult()
        const isAdmin = idToken.claims.admin === true

        if (!isAdmin) {
          alert("Access denied: You are not an admin.")
          router.push("/")
        }
      })
    }

    authCheck()
  }, [router])

  useEffect(() => {
    async function fetchAdminStats() {
      setStats({ ...MOCK_DATA, isLoading: false, error: null, usingMockData: true })
    }

    fetchAdminStats()
  }, [])

  const formatLastActive = (timestamp?: Timestamp | string) => {
    if (!timestamp) return "Unknown"
    if (typeof timestamp === "string") return timestamp
    try {
      const now = new Date()
      const lastActiveDate = timestamp.toDate()
      const diffMs = now.getTime() - lastActiveDate.getTime()
      const diffMins = Math.floor(diffMs / (1000 * 60))
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`
      else if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
      else return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
    } catch {
      return "Unknown"
    }
  }

  if (stats.isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 border-4 border-[#2c7be5] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white">Loading dashboard data...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-8">
          Admin Dashboard
          <br />
          <span className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
            System Overview
          </span>
        </h1>

        {stats.error && (
          <div className="mb-6 p-4 bg-[#e63757]/10 border border-[#e63757]/30 rounded-lg text-white">{stats.error}</div>
        )}

        {stats.usingMockData && (
          <div className="mb-6 p-4 bg-[#2c7be5]/10 border border-[#2c7be5]/30 rounded-lg text-white">
            Preview mode: Showing sample data. Connect to Firebase in production to see real data.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-6 rounded-lg border border-[#215cac]/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#5e6e82] text-sm">Total Users</p>
                <h3 className="text-2xl font-bold text-white mt-1">{stats.totalUsers}</h3>
              </div>
              <div className="bg-[#2c7be5]/10 p-3 rounded-lg">
                <Users className="h-6 w-6 text-[#2c7be5]" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-6 rounded-lg border border-[#215cac]/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#5e6e82] text-sm">Active Sessions</p>
                <h3 className="text-2xl font-bold text-white mt-1">{stats.activeSessions}</h3>
              </div>
              <div className="bg-[#00d27a]/10 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-[#00d27a]" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-6 rounded-lg border border-[#215cac]/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#5e6e82] text-sm">System Events</p>
                <h3 className="text-2xl font-bold text-white mt-1">{stats.systemEvents}</h3>
              </div>
              <div className="bg-[#27bcfd]/10 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-[#27bcfd]" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Link
            href="/admin/users"
            className="bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-6 rounded-lg border border-[#215cac]/20 shadow-lg hover:border-[#215cac]/40 transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <Users className="h-6 w-6 text-[#2c7be5]" />
              <h3 className="text-xl font-bold text-white group-hover:text-[#2c7be5] transition-colors">
                User Management
              </h3>
            </div>
            <p className="text-[#5e6e82] text-sm">Add, edit, or remove users from the system</p>
          </Link>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Recent Users</h2>
          <div className="bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] rounded-lg border border-[#215cac]/20 shadow-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#215cac]/20">
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5e6e82] uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5e6e82] uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5e6e82] uppercase tracking-wider">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentUsers.length > 0 ? (
                  stats.recentUsers.map((user) => (
                    <tr key={user.id} className="border-b border-[#215cac]/10 hover:bg-[#215cac]/5">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {user.name || user.email.split("@")[0]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#d8e2ef]">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5e6e82]">
                        {formatLastActive(user.lastActive)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-[#5e6e82]">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}


