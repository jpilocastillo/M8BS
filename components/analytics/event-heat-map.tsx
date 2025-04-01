"use client"

import { useState } from "react"

interface EventHeatmapProps {
  events: any[]
}

export default function EventHeatmap({ events }: EventHeatmapProps) {
  const [metric, setMetric] = useState("roi")

  // Define metrics options
  const metrics = [
    { id: "roi", name: "ROI", format: (val: number) => `${val.toFixed(1)}%` },
    { id: "conversionRate", name: "Conversion", format: (val: number) => `${val.toFixed(1)}%` },
    { id: "revenue", name: "Revenue", format: (val: number) => `$${val.toLocaleString()}` },
  ]

  // Get unique topics and locations
  const topics = [...new Set(events.map((event) => event.topic))]
  const locations = [...new Set(events.map((event) => event.location))]

  // Create heatmap data
  const heatmapData = topics.map((topic) => {
    const row: any = { topic }

    locations.forEach((location) => {
      const matchingEvents = events.filter((event) => event.topic === topic && event.location === location)
      if (matchingEvents.length > 0) {
        // Calculate average for the metric if multiple events match
        const sum = matchingEvents.reduce((acc, event) => acc + event[metric], 0)
        row[location] = sum / matchingEvents.length
      } else {
        row[location] = null
      }
    })

    return row
  })

  // Get selected metric details
  const currentMetric = metrics.find((m) => m.id === metric) || metrics[0]

  // Get min and max values for the selected metric
  const allValues = events.map((event) => event[metric])
  const minValue = Math.min(...allValues)
  const maxValue = Math.max(...allValues)

  // Function to get color intensity based on value
  const getColorIntensity = (value: number | null) => {
    if (value === null) return "bg-[#050117]/30"

    const normalizedValue = (value - minValue) / (maxValue - minValue)

    if (metric === "roi" || metric === "conversionRate") {
      return `rgba(44, 123, 229, ${0.2 + normalizedValue * 0.8})`
    } else {
      return `rgba(0, 210, 122, ${0.2 + normalizedValue * 0.8})`
    }
  }

  return (
    <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white mb-2 md:mb-0">Performance Heatmap</h3>
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

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-2 text-left text-sm font-bold text-white">Topic / Location</th>
              {locations.map((location) => (
                <th key={location} className="p-2 text-center text-xs font-medium text-[#5e6e82]">
                  {location}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heatmapData.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t border-[#215cac]/10">
                <td className="p-2 text-left text-sm font-medium text-white">{row.topic}</td>
                {locations.map((location) => (
                  <td key={location} className="p-2 text-center">
                    {row[location] !== null ? (
                      <div
                        className="w-full h-10 rounded flex items-center justify-center text-white text-xs font-medium"
                        style={{ backgroundColor: getColorIntensity(row[location]) }}
                      >
                        {currentMetric.format(row[location])}
                      </div>
                    ) : (
                      <div className="w-full h-10 rounded bg-[#050117]/30 flex items-center justify-center text-[#5e6e82] text-xs">
                        N/A
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

