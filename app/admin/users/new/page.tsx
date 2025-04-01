"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"
import { createUserViaApi } from "@/lib/firebase-admin"

export default function NewUserPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "user",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ user: any; tempPassword: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // In preview mode, simulate success with mock data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess({
        user: {
          uid: `mock-${Date.now()}`,
          email: formData.email,
          displayName: formData.name,
          role: formData.role,
        },
        tempPassword: "TempPass123!",
      })

      setLoading(false)
      return

      // The code below is kept but not executed in preview mode
      const result = await createUserViaApi(formData)

      if (result.success && result.user) {
        setSuccess({
          user: result.user,
          tempPassword: result.tempPassword || "Unknown",
        })
      } else {
        setError(result.error?.message || "Failed to create user. Please try again.")
      }
    } catch (err: any) {
      console.error("Error creating user:", err)
      setError(err.message || "An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => router.push("/admin/users")}
            className="text-[#5e6e82] hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold text-white">Add New User</h1>
        </div>

        <div className="bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] rounded-lg border border-[#215cac]/20 shadow-lg p-6 max-w-2xl mx-auto">
          {success ? (
            <div className="text-center">
              <div className="bg-[#00d27a]/10 text-[#00d27a] p-4 rounded-lg mb-6">
                <h3 className="text-xl font-bold mb-2">User Created Successfully!</h3>
                <p>
                  {success.user.displayName || success.user.email} has been added as a{" "}
                  {success.user.role === "admin" ? "an administrator" : "user"}.
                </p>
              </div>

              <div className="bg-[#2c7be5]/10 border border-[#2c7be5]/30 rounded-lg p-4 mb-6">
                <h4 className="font-bold mb-2">Temporary Password</h4>
                <p className="mb-2">The user will need to change this password on first login.</p>
                <div className="bg-[#0a0a29] p-3 rounded font-mono text-[#d8e2ef] mb-2">{success.tempPassword}</div>
                <p className="text-[#5e6e82] text-sm">Make sure to share this password securely with the user.</p>
              </div>

              <div className="flex gap-4 justify-center mt-6">
                <button
                  onClick={() => router.push("/admin/users")}
                  className="bg-[#2c7be5] hover:bg-[#1a68d1] text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Back to Users
                </button>
                <button
                  onClick={() => {
                    setSuccess(null)
                    setFormData({ email: "", name: "", role: "user" })
                  }}
                  className="bg-transparent border border-[#2c7be5] text-[#2c7be5] hover:bg-[#2c7be5]/10 px-6 py-2 rounded-lg transition-colors"
                >
                  Add Another User
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="bg-[#e63757]/10 border border-[#e63757]/30 text-[#e63757] p-4 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <div className="mb-6">
                <label htmlFor="email" className="block text-[#d8e2ef] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0a0a29] border border-[#215cac]/40 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#2c7be5]"
                  placeholder="user@example.com"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="name" className="block text-[#d8e2ef] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0a0a29] border border-[#215cac]/40 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#2c7be5]"
                  placeholder="John Doe"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="role" className="block text-[#d8e2ef] mb-2">
                  User Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full bg-[#0a0a29] border border-[#215cac]/40 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#2c7be5]"
                >
                  <option value="user">Regular User</option>
                  <option value="admin">Administrator</option>
                </select>
                <p className="text-[#5e6e82] text-sm mt-1">
                  Administrators have full access to all features and settings.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#2c7be5] hover:bg-[#1a68d1] text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-70 flex items-center gap-2"
                >
                  {loading && <Loader2 size={18} className="animate-spin" />}
                  {loading ? "Creating User..." : "Create User"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

