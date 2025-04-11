"use client"

import { useState, useEffect } from "react"
import {
  BarChart2,
  LogOut,
  Settings,
  Database,
  ChevronDown,
  ChevronRight,
  FileSpreadsheet,
  PlusCircle,
  LineChart,
  User,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ThemeToggle } from "./theme-toggle"

export default function SideNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [isDataMenuOpen, setIsDataMenuOpen] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [user, setUser] = useState(null)

  // Check if user is admin
  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        const userData = JSON.parse(userStr)
        // In a real app, you would check the user's role from your database
        setIsAdmin(userData.role === "admin")
        setUser(userData)
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])

  // Simplified logout function that doesn't rely on Firebase
  const handleLogout = () => {
    try {
      // Clear user data from localStorage
      localStorage.removeItem("user")

      // Redirect to login page
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <div className="w-[220px] min-h-screen bg-gradient-to-b from-[#050117] to-[#0a0a29] border-r border-[#215cac]/20 flex flex-col justify-between">
      {/* Main navigation section */}
      <div className="p-5">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]"
          >
            M8BS
          </Link>
        </div>
        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className={`flex items-center p-3 ${
              pathname === "/dashboard"
                ? "bg-gradient-to-r from-[#215cac]/20 to-[#2c7be5]/20 text-white"
                : "text-[#5e6e82] hover:text-white"
            } rounded-md text-sm font-medium transition-all duration-300 hover:from-[#215cac]/30 hover:to-[#2c7be5]/30`}
          >
            <BarChart2 className="h-5 w-5 text-[#2c7be5] mr-3" />
            <span className="font-bold">Dashboard</span>
          </Link>

          <Link
            href="/analytics"
            className={`flex items-center p-3 ${
              pathname === "/analytics"
                ? "bg-gradient-to-r from-[#215cac]/20 to-[#2c7be5]/20 text-white"
                : "text-[#5e6e82] hover:text-white"
            } rounded-md text-sm font-medium transition-all duration-300 hover:from-[#215cac]/30 hover:to-[#2c7be5]/30`}
          >
            <LineChart className="h-5 w-5 text-[#27bcfd] mr-3" />
            <span className="font-bold">Analytics</span>
          </Link>

          {/* Data Management dropdown */}
          <div className="space-y-1">
            <button
              onClick={() => setIsDataMenuOpen(!isDataMenuOpen)}
              className={`flex items-center justify-between w-full p-3 ${
                pathname.includes("/data-management") || pathname.includes("/marketing-data")
                  ? "bg-gradient-to-r from-[#215cac]/20 to-[#2c7be5]/20 text-white"
                  : "text-[#5e6e82] hover:text-white"
              } rounded-md text-sm font-medium transition-all duration-300 hover:from-[#215cac]/30 hover:to-[#2c7be5]/30`}
            >
              <div className="flex items-center">
                <Database className="h-5 w-5 text-[#2c7be5] mr-3" />
                <span className="font-bold">Marketing Data</span>
              </div>
              {isDataMenuOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>

            {isDataMenuOpen && (
              <div className="pl-11 space-y-1">
                <Link
                  href="/data-management"
                  className={`flex items-center p-2 ${
                    pathname === "/data-management" ? "text-white" : "text-[#5e6e82] hover:text-white"
                  } rounded-md text-sm transition-all duration-300`}
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  <span>View All Events</span>
                </Link>
                <Link
                  href="/data-management/new"
                  className={`flex items-center p-2 ${
                    pathname === "/data-management/new" ? "text-white" : "text-[#5e6e82] hover:text-white"
                  } rounded-md text-sm transition-all duration-300`}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  <span>New Event</span>
                </Link>
              </div>
            )}
          </div>

          {isAdmin && (
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold uppercase text-[#5e6e82]">Admin</div>
              <Link
                href="/admin/user"
                className={`flex items-center p-3 ${
                  pathname === "/admin/user"
                    ? "bg-gradient-to-r from-[#215cac]/20 to-[#2c7be5]/20 text-white"
                    : "text-[#5e6e82] hover:text-white"
                } rounded-md text-sm font-medium transition-all duration-300 hover:from-[#215cac]/30 hover:to-[#2c7be5]/30`}
              >
                <User className="h-5 w-5 text-[#e63757] mr-3" />
                <span className="font-bold">User Management</span>
              </Link>
            </div>
          )}

          <Link
            href="/settings"
            className={`flex items-center p-3 ${
              pathname === "/settings"
                ? "bg-gradient-to-r from-[#215cac]/20 to-[#2c7be5]/20 text-white"
                : "text-[#5e6e82] hover:text-white"
            } rounded-md text-sm font-medium transition-all duration-300 hover:from-[#215cac]/30 hover:to-[#2c7be5]/30`}
          >
            <Settings className="h-5 w-5 text-[#2c7be5] mr-3" />
            <span className="font-bold">Settings</span>
          </Link>
        </nav>
      </div>

      {/* Logout section */}
      <div className="mt-auto p-5 border-t border-[#215cac]/20">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 rounded-full bg-[#215cac]/20 flex items-center justify-center">
            <span className="text-lg font-bold">{user?.name?.charAt(0) || "U"}</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{user?.name || "User"}</p>
            <p className="text-xs text-[#5e6e82]">{user?.email || "user@example.com"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <ThemeToggle />
          <span className="text-sm text-[#5e6e82]">Theme</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center w-full p-3 text-[#5e6e82] hover:text-white rounded-md text-sm font-medium transition-all duration-300 hover:bg-[#215cac]/20"
        >
          <LogOut className="h-5 w-5 text-[#e63757] mr-3" />
          <span className="font-bold">Logout</span>
        </button>
      </div>
    </div>
  )
}
