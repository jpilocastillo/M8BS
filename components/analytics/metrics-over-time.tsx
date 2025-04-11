"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface MetricsOverTimeProps {
  events: any[]
}

export default function MetricsOverTime({ events }: MetricsOverTimeProps) {
  const [selectedMetric, setSelectedMetric] = useState("roi")

  // Define metrics options
  const metrics = [
    { id: "roi", name: "ROI (%)", color: "#2c7be5" },
    { id: "conversionRate", name: "Conversion Rate (%)", color: "#27bcfd" },
    { id: "revenue", name: "Revenue ($K)", color: "#00d27a" },
    { id: "attendees", name: "Attendees", color: "#e63757" },
    { id: "clients", name: "Clients", color: "#748194" },
  ]

  // Get selected metric details
  const currentMetric = metrics.find((m) => m.id === selectedMetric) || metrics[0]

  // Create static demo data that will definitely render
  const demoData = [
    { month: "Jan", roi: 220, conversionRate: 5.2, revenue: 180, attendees: 19, clients: 1 },
    { month: "Feb", roi: 245, conversionRate: 6.5, revenue: 210, attendees: 31, clients: 2 },
    { month: "Mar", roi: 198, conversionRate: 4.8, revenue: 150, attendees: 21, clients: 1 },
    { month: "Apr", roi: 310, conversionRate: 8.1, revenue: 280, attendees: 37, clients: 3 },
    { month: "May", roi: 265, conversionRate: 7.4, revenue: 230, attendees: 27, clients: 2 },
    { month: "Jun", roi: 285, conversionRate: 7.7, revenue: 240, attendees: 26, clients: 2 },
    { month: "Jul", roi: 225, conversionRate: 5.5, revenue: 190, attendees: 18, clients: 1 },
    { month: "Aug", roi: 250, conversionRate: 6.8, revenue: 220, attendees: 29, clients: 2 },
    { month: "Sep", roi: 274, conversionRate: 7.1, revenue: 259, attendees: 28, clients: 2 },
  ]

  return (
    <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white mb-2 md:mb-0">Metrics Over Time</h3>
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

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={demoData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#215cac30" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={{ stroke: "#215cac30" }}
              tickLine={false}
              tick={{ fill: "#5e6e82", fontSize: 12 }}
            />
            <YAxis axisLine={{ stroke: "#215cac30" }} tickLine={false} tick={{ fill: "#5e6e82", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0a0a29",
                borderColor: "#215cac50",
                borderRadius: "0.375rem",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
              itemStyle={{ color: "#fff" }}
              formatter={(value) => [value, ""]}
              labelStyle={{ color: "#5e6e82", fontWeight: "bold", marginBottom: "0.5rem" }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "10px" }}
              formatter={(value) => (
                <span style={{ color: "#d8e2ef" }}>{selectedMetric === "revenue" ? "Revenue ($K)" : value}</span>
              )}
            />
            <defs>
              <linearGradient id={`barGradient-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={currentMetric.color} stopOpacity={1} />
                <stop offset="100%" stopColor={`${currentMetric.color}80`} stopOpacity={0.8} />
              </linearGradient>
            </defs>
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
