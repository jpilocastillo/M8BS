"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import SideNav from "@/components/side-nav"

export default function SettingsPage() {
  const router = useRouter()
  const [userData, setUserData] = useState({ name: "", email: "" })

  // Check if user is logged in
  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (!userStr) {
      router.push("/")
      return
    }

    try {
      const user = JSON.parse(userStr)
      setUserData({
        name: user.name || "Test User",
        email: user.email || "test@example.com",
      })
    } catch (error) {
      console.error("Error parsing user data:", error)
    }
  }, [router])

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

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">
            Settings
            <br />
            <span className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
              User Profile
            </span>
          </h1>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 p-6">
          <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
            Profile Settings
          </h2>

          <div className="mb-8 flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32 rounded-full bg-[#215cac]/20 flex items-center justify-center overflow-hidden border-2 border-[#215cac]/40">
                <User className="h-16 w-16 text-[#2c7be5]" />
                <button className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-sm font-medium transition-opacity">
                  Change Photo
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-white">First Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white"
                    placeholder="John"
                    value={userData.name.split(" ")[0]}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-white">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white"
                    placeholder="Doe"
                    value={userData.name.split(" ")[1] || ""}
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-white">Email Address</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white"
                  placeholder="john.doe@example.com"
                  value={userData.email}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="border-t border-[#215cac]/20 pt-6 mt-6">
            <h3 className="text-lg font-bold mb-4 text-white">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-white">Current Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white"
                  placeholder="••••••••"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-white">New Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-white">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button className="px-4 py-2 bg-gradient-to-r from-[#2c7be5] to-[#27bcfd] text-white font-bold rounded-md flex items-center gap-2 hover:opacity-90 transition-opacity">
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
