"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface StackedComparisonChartProps {
  events: any[]
}

export default function StackedComparisonChart({ events }: StackedComparisonChartProps) {
  const [sortBy, setSortBy] = useState("date")
  const [sortDirection, setSortDirection] = useState("asc")

  // Sort events
  const sortedEvents = [...events].sort((a, b) => {
    let valueA, valueB

    if (sortBy === "date") {
      valueA = new Date(a.date).getTime()
      valueB = new Date(b.date).getTime()
    } else if (sortBy === "totalRevenue") {
      // Calculate total revenue for sorting
      valueA = a.revenue || 0
      valueB = b.revenue || 0
    } else {
      valueA = a[sortBy] || 0
      valueB = b[sortBy] || 0
    }

    return sortDirection === "asc" ? valueA - valueB : valueB - valueA
  })

  // Limit to 8 events for better visibility
  const limitedEvents = sortedEvents.slice(0, 8)

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  // Prepare data for chart
  const chartData = limitedEvents.map((event) => {
    // Calculate revenue components (using dummy data since we don't have the breakdown)
    const fixedAnnuityRevenue = event.revenue * 0.6 // 60% of revenue
    const aumRevenue = event.revenue * 0.3 // 30% of revenue
    const planningRevenue = event.revenue * 0.1 // 10% of revenue

    return {
      name: formatDate(event.date),
      fixedAnnuity: Math.round(fixedAnnuityRevenue),
      aum: Math.round(aumRevenue),
      planning: Math.round(planningRevenue),
      totalRevenue: event.revenue,
      location: event.location,
      topic: event.topic,
      fullDate: event.date,
    }
  })

  // Handle sort change
  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortDirection("asc")
    }
  }

  return (
    <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white mb-2 md:mb-0">Revenue Breakdown by Event</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSortChange("date")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              sortBy === "date"
                ? "bg-[#215cac]/40 text-white"
                : "bg-[#050117] text-[#5e6e82] hover:bg-[#215cac]/20 hover:text-white"
            }`}
          >
            Sort by Date {sortBy === "date" && (sortDirection === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSortChange("totalRevenue")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              sortBy === "totalRevenue"
                ? "bg-[#215cac]/40 text-white"
                : "bg-[#050117] text-[#5e6e82] hover:bg-[#215cac]/20 hover:text-white"
            }`}
          >
            Sort by Revenue {sortBy === "totalRevenue" && (sortDirection === "asc" ? "↑" : "↓")}
          </button>
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 70 }}>
              <defs>
                <linearGradient id="colorFixedAnnuity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2c7be5" stopOpacity={1} />
                  <stop offset="100%" stopColor="#2c7be5" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="colorAUM" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#27bcfd" stopOpacity={1} />
                  <stop offset="100%" stopColor="#27bcfd" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="colorPlanning" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d27a" stopOpacity={1} />
                  <stop offset="100%" stopColor="#00d27a" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#215cac30" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={{ stroke: "#215cac30" }}
                tickLine={false}
                tick={{ fill: "#5e6e82", fontSize: 12 }}
                height={70}
                angle={-45}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                axisLine={{ stroke: "#215cac30" }}
                tickLine={false}
                tick={{ fill: "#5e6e82", fontSize: 12 }}
                width={80}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0a0a29",
                  borderColor: "#215cac50",
                  borderRadius: "0.375rem",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
                itemStyle={{ color: "#fff" }}
                formatter={(value, name, props) => {
                  let displayName = name
                  let color = "#fff"

                  if (name === "fixedAnnuity") {
                    displayName = "Fixed Annuity"
                    color = "#2c7be5"
                  } else if (name === "aum") {
                    displayName = "AUM"
                    color = "#27bcfd"
                  } else if (name === "planning") {
                    displayName = "Planning"
                    color = "#00d27a"
                  }

                  return [
                    <span key={`value-${name}`} style={{ color }}>
                      ${Number(value).toLocaleString()}
                    </span>,
                    displayName,
                  ]
                }}
                labelFormatter={(label, payload) => {
                  if (payload && payload.length > 0) {
                    const data = payload[0].payload
                    return (
                      <div>
                        <div className="font-bold">{label}</div>
                        <div className="text-xs text-[#5e6e82] mt-1">Location: {data.location}</div>
                        <div className="text-xs text-[#5e6e82]">Topic: {data.topic}</div>
                        <div className="text-xs text-[#5e6e82]">
                          Date: {new Date(data.fullDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs font-bold text-white mt-1">
                          Total: ${Number(data.totalRevenue).toLocaleString()}
                        </div>
                      </div>
                    )
                  }
                  return label
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(value) => {
                  let displayName = value
                  let color = "#fff"

                  if (value === "fixedAnnuity") {
                    displayName = "Fixed Annuity"
                    color = "#2c7be5"
                  } else if (value === "aum") {
                    displayName = "AUM"
                    color = "#27bcfd"
                  } else if (value === "planning") {
                    displayName = "Planning"
                    color = "#00d27a"
                  }

                  return <span style={{ color }}>{displayName}</span>
                }}
              />
              <Bar dataKey="fixedAnnuity" stackId="a" fill="url(#colorFixedAnnuity)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="aum" stackId="a" fill="url(#colorAUM)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="planning" stackId="a" fill="url(#colorPlanning)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[400px] w-full flex items-center justify-center">
          <p className="text-[#5e6e82]">No data available for the selected filters</p>
        </div>
      )}
    </div>
  )
}
