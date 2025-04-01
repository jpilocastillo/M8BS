"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { loginUser } from "@/lib/firebase"

export default function AdminLogin() {
  const router = useRouter()
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await loginUser(credentials.email, credentials.password)

    if (result.success && result.user) {
      // optional: check if user is admin here
      router.push("/admin/dashboard")
    } else {
      setError("Invalid email or password")
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleLogin}>
      {/* your inputs + UI here */}
    </form>
  )
}

