import type React from "react"
import { AlertCircle, UserPlus } from "lucide-react"
import Link from "next/link"

interface EmptyStateWidgetWithSignupProps {
  title: string
  message?: string
  icon?: React.ReactNode
}

export default function EmptyStateWidgetWithSignup({
  title,
  message = "No data available yet. Add a new user to get started.",
  icon,
}: EmptyStateWidgetWithSignupProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="mb-3 text-[#2c7be5]">{icon || <AlertCircle className="h-10 w-10" />}</div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-[#5e6e82] mb-4">{message}</p>
      <Link
        href="/admin/users"
        className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#2c7be5] to-[#27bcfd] text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
      >
        <UserPlus className="h-5 w-5" />
        <span>Add New User</span>
      </Link>
    </div>
  )
}

