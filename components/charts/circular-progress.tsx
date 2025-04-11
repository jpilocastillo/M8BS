"use client"

import type React from "react"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

interface CircularProgressProps {
  value: number
  size?: number
  thickness?: number
  color?: string
  secondaryColor?: string
  centerText?: string | React.ReactNode
}

export default function CircularProgress({
  value,
  size = 120,
  thickness = 10,
  color = "#2c7be5",
  secondaryColor = "#050117",
  centerText,
}: CircularProgressProps) {
  // Calculate the remaining percentage
  const remaining = 100 - value

  // Data for the pie chart
  const data = [
    { name: "Value", value: value },
    { name: "Remaining", value: remaining },
  ]

  // Calculate inner radius based on thickness
  const outerRadius = size / 2
  const innerRadius = outerRadius - thickness

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            <linearGradient id="primaryGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={`${color}80`} />
            </linearGradient>
          </defs>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={90}
            endAngle={-270}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={0}
            dataKey="value"
            strokeWidth={0}
          >
            <Cell fill="url(#primaryGradient)" />
            <Cell fill={secondaryColor} opacity={0.2} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {centerText && (
        <div className="absolute inset-0 flex items-center justify-center">
          {typeof centerText === "string" ? (
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
              {centerText}
            </span>
          ) : (
            centerText
          )}
        </div>
      )}
    </div>
  )
}
