"use client"

import { useState } from "react"
import { Trophy, Calendar, MapPin } from "lucide-react"

interface TopPerformersProps {
  events: any[]
}

export default function TopPerformers({ events }: TopPerformersProps) {
  const [metric, setMetric] = useState("roi")

  // Define metrics options
  const metrics = [
    { id: "roi", name: "ROI", format: (val: number) => `${val.toFixed(1)}%` },
    { id: "conversionRate", name: "Conversion", format: (val: number) => `${val.toFixed(1)}%` },
    { id: "revenue", name: "Revenue", format: (val: number) => `$${val.toLocaleString()}` },
    { id: "attendees", name: "Attendees", format: (val: number) => val },
    { id: "clients", name: "Clients", format: (val: number) => val },
  ]

  // Sort events by selected metric
  const sortedEvents = [...events].sort((a, b) => b[metric] - a[metric])

  // Get top 5 events
  const topEvents = sortedEvents.slice(0, 5)

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  // Get selected metric details
  const currentMetric = metrics.find((m) => m.id === metric) || metrics[0]

  return (
    <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white mb-2 md:mb-0">Top Performers</h3>
        <div className="flex flex-wrap gap-2">
          {metrics.map((m) => (
            <button
              key={m.id}
              onClick={() => setMetric(m.id)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                metric === m.id
                  ? "bg-gradient-to-r from-[#215cac] to-[#2c7be5] text-white"
                  : "bg-[#050117] text-[#5e6e82] hover:bg-[#215cac]/20 hover:text-white"
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {topEvents.map((event, index) => (
          <div
            key={event.id}
            className="bg-[#050117]/50 p-3 rounded-lg border border-[#215cac]/10 hover:border-[#215cac]/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className={`
                h-10 w-10 rounded-full flex items-center justify-center text-white font-bold
                ${
                  index === 0
                    ? "bg-gradient-to-br from-[#ffc107] to-[#ff9800]"
                    : index === 1
                      ? "bg-gradient-to-br from-[#b0bec5] to-[#78909c]"
                      : index === 2
                        ? "bg-gradient-to-br from-[#cd7f32] to-[#a05a2c]"
                        : "bg-gradient-to-br from-[#215cac] to-[#2c7be5]"
                }
              `}
              >
                {index === 0 ? <Trophy className="h-5 w-5" /> : index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white">{event.topic}</h4>
                  <div className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
                    {currentMetric.format(event[metric])}
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-[#5e6e82]">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {topEvents.length === 0 && (
          <div className="bg-[#050117]/50 p-6 rounded-lg border border-[#215cac]/10 text-center">
            <p className="text-[#5e6e82]">No events match the current filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
