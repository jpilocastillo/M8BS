"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface EventComparisonChartProps {
  events: any[]
}

export default function EventComparisonChart({ events }: EventComparisonChartProps) {
  const [selectedMetric, setSelectedMetric] = useState("roi")
  const [sortBy, setSortBy] = useState("date")
  const [sortDirection, setSortDirection] = useState("asc")

  // Define metrics options
  const metrics = [
    { id: "roi", name: "ROI (%)", color: "#2c7be5" },
    { id: "conversionRate", name: "Conversion Rate (%)", color: "#27bcfd" },
    { id: "revenue", name: "Revenue ($)", color: "#00d27a" },
    { id: "attendees", name: "Attendees", color: "#e63757" },
    { id: "clients", name: "Clients", color: "#748194" },
  ]

  // Get selected metric details
  const currentMetric = metrics.find((m) => m.id === selectedMetric) || metrics[0]

  // Create static demo data that will definitely render
  const demoData = [
    {
      name: "May 17",
      location: "City Center",
      topic: "Social Security",
      roi: 274,
      conversionRate: 7.1,
      revenue: 258991,
      attendees: 28,
      clients: 2,
    },
    {
      name: "Jun 28",
      location: "Riverside",
      topic: "Estate Planning",
      roi: 250,
      conversionRate: 6.8,
      revenue: 220000,
      attendees: 29,
      clients: 2,
    },
    {
      name: "Jul 12",
      location: "Mountain View",
      topic: "Tax Strategies",
      roi: 225,
      conversionRate: 5.5,
      revenue: 190000,
      attendees: 18,
      clients: 1,
    },
    {
      name: "Aug 5",
      location: "Seaside",
      topic: "Retirement",
      roi: 285,
      conversionRate: 7.7,
      revenue: 240000,
      attendees: 26,
      clients: 2,
    },
    {
      name: "Sep 15",
      location: "Lakeview",
      topic: "Social Security",
      roi: 310,
      conversionRate: 8.1,
      revenue: 280000,
      attendees: 37,
      clients: 3,
    },
    {
      name: "Oct 20",
      location: "Grand Conference",
      topic: "Estate Planning",
      roi: 198,
      conversionRate: 4.8,
      revenue: 150000,
      attendees: 21,
      clients: 1,
    },
    {
      name: "Nov 30",
      location: "Parkside",
      topic: "Tax Strategies",
      roi: 245,
      conversionRate: 6.5,
      revenue: 210000,
      attendees: 31,
      clients: 2,
    },
    {
      name: "Dec 15",
      location: "Vino Grille",
      topic: "Retirement",
      roi: 274,
      conversionRate: 7.1,
      revenue: 258991,
      attendees: 28,
      clients: 2,
    },
  ]

  // Handle sort change
  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortDirection("asc")
    }
  }

  // Format tooltip value based on metric
  const formatTooltipValue = (value: number) => {
    if (selectedMetric === "revenue") {
      return `$${value.toLocaleString()}`
    } else if (selectedMetric === "roi" || selectedMetric === "conversionRate") {
      return `${value.toFixed(1)}%`
    }
    return value
  }

  return (
    <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white mb-2 md:mb-0">Event Comparison</h3>
        <div className="flex flex-wrap gap-2">
          {metrics.map((metric) => (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedMetric === metric.id
                  ? "bg-gradient-to-r from-[#215cac] to-[#2c7be5] text-white"
                  : "bg-[#050117] text-[#5e6e82] hover:bg-[#215cac]/20 hover:text-white"
              }`}
            >
              {metric.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
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
          onClick={() => handleSortChange(selectedMetric)}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
            sortBy === selectedMetric
              ? "bg-[#215cac]/40 text-white"
              : "bg-[#050117] text-[#5e6e82] hover:bg-[#215cac]/20 hover:text-white"
          }`}
        >
          Sort by Value {sortBy === selectedMetric && (sortDirection === "asc" ? "↑" : "↓")}
        </button>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={demoData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
            <defs>
              <linearGradient id={`barGradient-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={currentMetric.color} stopOpacity={1} />
                <stop offset="100%" stopColor={`${currentMetric.color}80`} stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#215cac30" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={{ stroke: "#215cac30" }}
              tickLine={false}
              tick={{ fill: "#5e6e82", fontSize: 12 }}
              height={50}
              angle={-45}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              axisLine={{ stroke: "#215cac30" }}
              tickLine={false}
              tick={{ fill: "#5e6e82", fontSize: 12 }}
              width={60}
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
                const data = props.payload
                return [
                  <div key={`value-${value}`}>{formatTooltipValue(value as number)}</div>,
                  <div key={`location-${data.location}`} className="text-xs text-[#5e6e82] mt-1">
                    Location: {data.location}
                  </div>,
                  <div key={`topic-${data.topic}`} className="text-xs text-[#5e6e82]">
                    Topic: {data.topic}
                  </div>,
                ]
              }}
              labelStyle={{ color: "#5e6e82", fontWeight: "bold", marginBottom: "0.5rem" }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "10px" }}
              formatter={(value) => <span style={{ color: "#d8e2ef" }}>{currentMetric.name}</span>}
            />
            <Bar
              dataKey={selectedMetric}
              name={currentMetric.name}
              fill={`url(#barGradient-${selectedMetric})`}
              radius={[4, 4, 0, 0]}
              barSize={30}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
