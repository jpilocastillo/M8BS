"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Mail, Key, LogIn, AlertCircle } from "lucide-react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function AdminLogin() {
  const router = useRouter()
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdTokenResult()
        if (token.claims.admin === true) {
          router.push("/admin/dashboard")
        } else {
          auth.signOut()
        }
      }
    })
    return () => unsub()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password)
      const user = userCredential.user

      const token = await user.getIdTokenResult()
      const isAdmin = token.claims.admin === true

      if (!isAdmin) {
        setError("You don't have admin privileges")
        await auth.signOut()
        setLoading(false)
        return
      }

      router.push("/admin/dashboard")
    } catch (err) {
      console.error("Login error:", err)
      setError("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#050117] to-[#0a0a29]">
      <div className="w-full max-w-md p-8 bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] rounded-lg border border-[#215cac]/20 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Login</h1>
          <p className="text-[#5e6e82] mt-2">Enter your credentials to access the admin panel</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[#e63757]/10 border border-[#e63757]/30 rounded-lg flex items-center text-white">
            <AlertCircle className="h-5 w-5 text-[#e63757] mr-2" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-white">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="w-full pl-10 pr-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white"
                placeholder="admin@example.com"
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
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full pl-10 pr-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white"
                placeholder="••••••••"
                required
              />
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5e6e82]" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-gradient-to-r from-[#2c7be5] to-[#27bcfd] rounded-md text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

