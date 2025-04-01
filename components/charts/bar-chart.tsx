"use client"

import { BarChart as RechartsBarChart, Bar, XAxis, ResponsiveContainer } from "recharts"

interface BarChartProps {
  data: any[]
  dataKey: string
  color?: string
  height?: number
  showAxis?: boolean
}

export default function BarChart({ data, dataKey, color = "#2c7be5", height = 50, showAxis = false }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        {showAxis && (
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#5e6e82" }} />
        )}
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={1} />
            <stop offset="100%" stopColor={`${color}80`} stopOpacity={0.8} />
          </linearGradient>
        </defs>
        <Bar dataKey={dataKey} fill="url(#barGradient)" radius={[4, 4, 0, 0]} barSize={showAxis ? 10 : 6} />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

