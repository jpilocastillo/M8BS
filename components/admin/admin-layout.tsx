"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Users, LogOut, Menu, X, ChevronDown, Shield } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [adminUser, setAdminUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simple function to check if user is admin
    const checkAdminUser = () => {
      try {
        const userStr = localStorage.getItem("user")
        if (!userStr) {
          console.log("No user found in localStorage")
          router.push("/admin/login")
          return false
        }

        const user = JSON.parse(userStr)
        if (!user || user.role !== "admin") {
          console.log("User is not an admin")
          router.push("/admin/login")
          return false
        }

        setAdminUser(user)
        return true
      } catch (error) {
        console.error("Error checking admin user:", error)
        router.push("/admin/login")
        return false
      } finally {
        setLoading(false)
      }
    }

    // Check admin status
    checkAdminUser()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/admin/login")
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#050117] to-[#0a0a29]">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 border-4 border-[#2c7be5] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  // If no admin user is found after loading, show access denied
  if (!adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#050117] to-[#0a0a29]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-[#d8e2ef] mb-6">You need admin privileges to access this area.</p>
          <Link
            href="/admin/login"
            className="px-4 py-2 bg-gradient-to-r from-[#2c7be5] to-[#27bcfd] rounded-md text-white font-bold"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050117] to-[#0a0a29] text-white">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-[#050117] border-b border-[#215cac]/20 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md text-[#5e6e82] hover:text-white focus:outline-none"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <span className="ml-3 text-xl font-bold">Admin</span>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-gradient-to-b from-[#050117] to-[#0a0a29] border-r border-[#215cac]/20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Admin logo */}
          <div className="p-5 border-b border-[#215cac]/20">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-[#e63757]" />
              <span className="ml-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
                Admin Panel
              </span>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <Link
              href="/admin/dashboard"
              className={`flex items-center px-4 py-3 rounded-md ${
                pathname === "/admin/dashboard"
                  ? "bg-gradient-to-r from-[#215cac]/20 to-[#2c7be5]/20 text-white"
                  : "text-[#5e6e82] hover:text-white hover:bg-[#215cac]/10"
              }`}
            >
              <LayoutDashboard className="h-5 w-5 mr-3" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin/user"
              className={`flex items-center px-4 py-3 rounded-md ${
                pathname === "/admin/user" || pathname.startsWith("/admin/user/")
                  ? "bg-gradient-to-r from-[#215cac]/20 to-[#2c7be5]/20 text-white"
                  : "text-[#5e6e82] hover:text-white hover:bg-[#215cac]/10"
              }`}
            >
              <Users className="h-5 w-5 mr-3" />
              <span>User Management</span>
            </Link>
            <Link
              href="/admin/roles"
              className={`flex items-center px-4 py-3 rounded-md ${
                pathname === "/admin/roles" || pathname.startsWith("/admin/roles/")
                  ? "bg-gradient-to-r from-[#215cac]/20 to-[#2c7be5]/20 text-white"
                  : "text-[#5e6e82] hover:text-white hover:bg-[#215cac]/10"
              }`}
            >
              <Users className="h-5 w-5 mr-3" />
              <span>User Roles</span>
            </Link>
          </nav>

          {/* Admin info and logout */}
          <div className="p-4 border-t border-[#215cac]/20">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-[#215cac]/20 flex items-center justify-center">
                <span className="text-lg font-bold">
                  {adminUser.displayName ? adminUser.displayName.charAt(0).toUpperCase() : "A"}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{adminUser.displayName || adminUser.email}</p>
                <p className="text-xs text-[#5e6e82]">{adminUser.email}</p>
              </div>
              <ChevronDown className="ml-auto h-4 w-4 text-[#5e6e82]" />
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-[#5e6e82] hover:text-[#e63757] rounded-md hover:bg-[#e63757]/10 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">{children}</div>
    </div>
  )
}
