"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface DetailedBarChartProps {
  data: any[]
  dataKey: string
  xAxisDataKey: string
  color?: string
  height?: number
  yAxisPrefix?: string
  yAxisSuffix?: string
}

export default function DetailedBarChart({
  data,
  dataKey,
  xAxisDataKey,
  color = "#2c7be5",
  height = 300,
  yAxisPrefix = "",
  yAxisSuffix = "",
}: DetailedBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={1} />
            <stop offset="100%" stopColor={`${color}80`} stopOpacity={0.8} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#215cac30" vertical={false} />
        <XAxis
          dataKey={xAxisDataKey}
          axisLine={{ stroke: "#215cac30" }}
          tickLine={false}
          tick={{ fill: "#5e6e82", fontSize: 12 }}
        />
        <YAxis
          axisLine={{ stroke: "#215cac30" }}
          tickLine={false}
          tick={{ fill: "#5e6e82", fontSize: 12 }}
          tickFormatter={(value) => `${yAxisPrefix}${value}${yAxisSuffix}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#0a0a29",
            borderColor: "#215cac50",
            borderRadius: "0.375rem",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          }}
          itemStyle={{ color: "#fff" }}
          formatter={(value) => [`${yAxisPrefix}${value}${yAxisSuffix}`, ""]}
          labelStyle={{ color: "#5e6e82", fontWeight: "bold", marginBottom: "0.5rem" }}
        />
        <Bar dataKey={dataKey} fill="url(#barGradient)" radius={[4, 4, 0, 0]} barSize={30} animationDuration={1500} />
      </BarChart>
    </ResponsiveContainer>
  )
}
