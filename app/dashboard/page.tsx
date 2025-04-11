"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardWithProvider from "@/components/dashboard"

export default function DashboardPage() {
  const router = useRouter()

  // Check if user is logged in
  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (!userStr) {
      router.push("/")
      return
    }

    // Check if user is admin, redirect to admin dashboard if so
    try {
      const user = JSON.parse(userStr)
      if (user.role === "admin") {
        router.push("/admin/dashboard")
        return
      }
    } catch (error) {
      console.error("Error parsing user data:", error)
      router.push("/")
    }
  }, [router])

  return <DashboardWithProvider />
}
