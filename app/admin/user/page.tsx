"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Edit, Trash2, UserPlus } from "lucide-react"
import Link from "next/link"
import AdminLayout from "@/components/admin/admin-layout"

// Define user interface
interface UserData {
  id: string
  email: string
  name?: string
  role?: string
  createdAt?: string
  lastActive?: string
}

export default function UserManagement() {
  const router = useRouter()
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load mock users for demo
  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      try {
        // Mock users data
        const mockUsers: UserData[] = [
          {
            id: "usr-001",
            email: "john@example.com",
            name: "John Doe",
            role: "user",
            createdAt: "2023-12-01",
            lastActive: "2023-12-25",
          },
          {
            id: "usr-002",
            email: "jane@example.com",
            name: "Jane Smith",
            role: "user",
            createdAt: "2023-12-15",
            lastActive: "2023-12-28",
          },
          {
            id: "usr-003",
            email: "admin@example.com",
            name: "Admin User",
            role: "admin",
            createdAt: "2023-11-01",
            lastActive: "2023-12-30",
          },
        ]

        setUsers(mockUsers)
        setLoading(false)
      } catch (err) {
        console.error("Error loading mock users:", err)
        setError("Failed to load users. Please try again.")
        setLoading(false)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      // Filter out the deleted user
      setUsers(users.filter((user) => user.id !== userId))
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-white">
            User Management
            <br />
            <span className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
              Admin Panel
            </span>
          </h1>

          <Link
            href="/admin/user/new"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#2c7be5] to-[#27bcfd] text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <UserPlus className="h-5 w-5" />
            <span>Add New User</span>
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[#e63757]/10 border border-[#e63757]/30 rounded-lg text-white">{error}</div>
        )}

        <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5">
          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="h-8 w-8 border-4 border-[#2c7be5] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#215cac]/20">
                    <th className="px-4 py-3 text-left text-sm font-bold text-white">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-white">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-white">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-white">Created</th>
                    <th className="px-4 py-3 text-right text-sm font-bold text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-[#215cac]/10 hover:bg-[#215cac]/5 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-white">
                        {user.name || user.email.split("@")[0]}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#d8e2ef]">{user.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === "admin" ? "bg-[#e63757]/10 text-[#e63757]" : "bg-[#00d27a]/10 text-[#00d27a]"
                          }`}
                        >
                          {user.role || "user"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#d8e2ef]">{user.createdAt || "Unknown"}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-1 text-[#5e6e82] hover:text-white transition-colors" title="Edit">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-1 text-[#5e6e82] hover:text-[#e63757] transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
