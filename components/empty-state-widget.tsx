import type React from "react"
import { AlertCircle } from "lucide-react"

interface EmptyStateWidgetProps {
  title: string
  message?: string
  icon?: React.ReactNode
}

export default function EmptyStateWidget({
  title,
  message = "Insufficient data to display this widget",
  icon,
}: EmptyStateWidgetProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="mb-3 text-[#2c7be5]">{icon || <AlertCircle className="h-10 w-10" />}</div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-[#5e6e82]">{message}</p>
    </div>
  )
}

