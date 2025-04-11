"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function RegisterPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const result = await signUp(formData.email, formData.password, formData.name)
      if (result.success) {
        router.push("/dashboard")
      } else {
        setError(result.error?.message || "Registration failed. Please try again.")
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a29]">
      <div className="w-full max-w-md p-8 space-y-8 bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] rounded-xl border border-[#215cac]/20 shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Create an Account</h1>
          <p className="mt-2 text-[#d8e2ef]/70">Sign up to access the dashboard</p>
        </div>

        {error && (
          <div className="bg-[#e63757]/10 border border-[#e63757]/30 text-[#e63757] p-4 rounded-lg">{error}</div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#d8e2ef]">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-[#0a0a29] border border-[#215cac]/40 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-[#2c7be5]"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#d8e2ef]">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-[#0a0a29] border border-[#215cac]/40 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-[#2c7be5]"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#d8e2ef]">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-[#0a0a29] border border-[#215cac]/40 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-[#2c7be5]"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2c7be5] hover:bg-[#1a68d1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2c7be5] disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-[#d8e2ef]/70">
            Already have an account?{" "}
            <Link href="/auth" className="font-medium text-[#2c7be5] hover:text-[#1a68d1]">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
