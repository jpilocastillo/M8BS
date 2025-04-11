"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, UserPlus } from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"
import { fetchUsers, deleteUserViaApi } from "@/lib/firebase-admin"

// Define types
interface User {
  uid: string
  email: string
  displayName?: string
  role?: string
  lastLogin?: string
  createdAt?: string
}

// Mock data for preview mode
const MOCK_USERS = [
  {
    uid: "mock-admin-1",
    email: "admin@example.com",
    displayName: "Admin User",
    role: "admin",
    lastLogin: new Date().toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    uid: "mock-user-1",
    email: "user1@example.com",
    displayName: "Regular User",
    role: "user",
    lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    uid: "mock-user-2",
    email: "user2@example.com",
    displayName: "Test User",
    role: "user",
    lastLogin: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteInProgress, setDeleteInProgress] = useState<string | null>(null)
  const [usingMockData, setUsingMockData] = useState(false)

  // Load users on component mount
  useEffect(() => {
    async function loadUsers() {
      try {
        const result = await fetchUsers()

        if (result.success && result.users) {
          setUsers(result.users)
          setError(null)
        } else {
          setError("Failed to load users. Please try again.")
          setUsers([])
        }
      } catch (err) {
        console.error("Error loading users:", err)
        setError("An unexpected error occurred. Please try again.")
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  // Handle user deletion
  const handleDeleteUser = async (uid: string) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      setDeleteInProgress(uid)

      if (usingMockData) {
        // Simulate deletion in mock mode
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setUsers(users.filter((user) => user.uid !== uid))
        setDeleteInProgress(null)
        return
      }

      try {
        const result = await deleteUserViaApi(uid)

        if (result.success) {
          // Remove the user from the list
          setUsers(users.filter((user) => user.uid !== uid))
        } else {
          alert("Failed to delete user. Please try again.")
        }
      } catch (err) {
        console.error("Error deleting user:", err)
        alert("An unexpected error occurred. Please try again.")
      } finally {
        setDeleteInProgress(null)
      }
    }
  }

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never"

    try {
      const date = new Date(dateString)
      return date.toLocaleDateString() + " " + date.toLocaleTimeString()
    } catch (err) {
      return "Invalid date"
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <button
            onClick={() => router.push("/admin/users/new")}
            className="flex items-center gap-2 bg-[#2c7be5] hover:bg-[#1a68d1] text-white px-4 py-2 rounded-lg transition-colors"
          >
            <UserPlus size={18} />
            <span>Add User</span>
          </button>
        </div>

        {usingMockData && (
          <div className="mb-6 p-4 bg-[#2c7be5]/10 border border-[#2c7be5]/30 rounded-lg text-white">
            Preview mode: Showing sample user data.
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-[#e63757]/10 border border-[#e63757]/30 rounded-lg text-white">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="h-10 w-10 border-4 border-[#2c7be5] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-8 rounded-lg border border-[#215cac]/20 shadow-lg text-center">
            <p className="text-[#d8e2ef] mb-4">No users found.</p>
            <button
              onClick={() => router.push("/admin/users/new")}
              className="flex items-center gap-2 bg-[#2c7be5] hover:bg-[#1a68d1] text-white px-4 py-2 rounded-lg transition-colors mx-auto"
            >
              <Plus size={18} />
              <span>Add Your First User</span>
            </button>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] rounded-lg border border-[#215cac]/20 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#215cac]/20">
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#5e6e82] uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#5e6e82] uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#5e6e82] uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#5e6e82] uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#5e6e82] uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[#5e6e82] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.uid} className="border-b border-[#215cac]/10 hover:bg-[#215cac]/5">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {user.displayName || "No name"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#d8e2ef]">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#d8e2ef]">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            user.role === "admin" ? "bg-[#00d27a]/20 text-[#00d27a]" : "bg-[#27bcfd]/20 text-[#27bcfd]"
                          }`}
                        >
                          {user.role || "user"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5e6e82]">
                        {formatDate(user.lastLogin)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5e6e82]">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteUser(user.uid)}
                          disabled={deleteInProgress === user.uid}
                          className="text-[#e63757] hover:text-[#e63757]/80 disabled:opacity-50"
                          aria-label="Delete user"
                        >
                          {deleteInProgress === user.uid ? (
                            <div className="h-5 w-5 border-2 border-[#e63757] border-t-transparent rounded-full animate-spin inline-block"></div>
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
