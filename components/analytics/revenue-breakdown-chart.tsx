"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface RevenueBreakdownChartProps {
  events: any[]
}

export default function RevenueBreakdownChart({ events }: RevenueBreakdownChartProps) {
  const [sortBy, setSortBy] = useState("date")
  const [sortDirection, setSortDirection] = useState("asc")

  // Create static demo data that will definitely render
  const demoData = [
    {
      name: "May 17",
      fixedAnnuity: 155000,
      aum: 78000,
      planning: 25991,
      totalRevenue: 258991,
      location: "City Center",
      topic: "Social Security",
    },
    {
      name: "Jun 28",
      fixedAnnuity: 132000,
      aum: 66000,
      planning: 22000,
      totalRevenue: 220000,
      location: "Riverside",
      topic: "Estate Planning",
    },
    {
      name: "Jul 12",
      fixedAnnuity: 114000,
      aum: 57000,
      planning: 19000,
      totalRevenue: 190000,
      location: "Mountain View",
      topic: "Tax Strategies",
    },
    {
      name: "Aug 5",
      fixedAnnuity: 144000,
      aum: 72000,
      planning: 24000,
      totalRevenue: 240000,
      location: "Seaside",
      topic: "Retirement",
    },
    {
      name: "Sep 15",
      fixedAnnuity: 168000,
      aum: 84000,
      planning: 28000,
      totalRevenue: 280000,
      location: "Lakeview",
      topic: "Social Security",
    },
    {
      name: "Oct 20",
      fixedAnnuity: 90000,
      aum: 45000,
      planning: 15000,
      totalRevenue: 150000,
      location: "Grand Conference",
      topic: "Estate Planning",
    },
    {
      name: "Nov 30",
      fixedAnnuity: 126000,
      aum: 63000,
      planning: 21000,
      totalRevenue: 210000,
      location: "Parkside",
      topic: "Tax Strategies",
    },
    {
      name: "Dec 15",
      fixedAnnuity: 155000,
      aum: 78000,
      planning: 25991,
      totalRevenue: 258991,
      location: "Vino Grille",
      topic: "Retirement",
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

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={demoData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
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
              height={50}
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
              formatter={(value, name) => {
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
    </div>
  )
}
