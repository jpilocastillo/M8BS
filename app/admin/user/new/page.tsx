"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Key, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import AdminLayout from "@/components/admin/admin-layout"

export default function NewUser() {
  const router = useRouter()
  const [newUser, setNewUser] = useState({ email: "", name: "", password: "", role: "user" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Call the API to create a new user
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to create user")
      }

      // Show success message
      alert(`User ${newUser.name} created successfully!`)

      // Redirect back to users list
      router.push("/admin/user")
    } catch (err) {
      console.error("Error adding user:", err)
      setError((err as Error).message || "Failed to create user. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <Link
            href="/admin/user"
            className="inline-flex items-center text-[#5e6e82] hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Users
          </Link>
          <h1 className="text-3xl font-bold text-white">
            Add New User
            <br />
            <span className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
              Admin Panel
            </span>
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[#e63757]/10 border border-[#e63757]/30 rounded-lg text-white">{error}</div>
        )}

        <div className="max-w-2xl">
          <div className="bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-6 rounded-lg border border-[#215cac]/20 shadow-lg">
            <form onSubmit={handleAddUser} className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2 text-white">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white"
                    placeholder="John Doe"
                    required
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5e6e82]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-white">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white"
                    placeholder="user@example.com"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5e6e82]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-white">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5e6e82]" />
                </div>
                <p className="text-xs text-[#5e6e82] mt-1">Password must be at least 6 characters long.</p>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-white">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Link
                  href="/admin/user"
                  className="px-4 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md text-white hover:bg-[#215cac]/20"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-gradient-to-r from-[#2c7be5] to-[#27bcfd] rounded-md text-white font-bold disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    "Create User"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
