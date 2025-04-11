"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from "recharts"

interface DetailedLineChartProps {
  data: any[]
  dataKey: string
  xAxisDataKey: string
  color?: string
  height?: number
  yAxisPrefix?: string
  yAxisSuffix?: string
  showArea?: boolean
}

export default function DetailedLineChart({
  data,
  dataKey,
  xAxisDataKey,
  color = "#2c7be5",
  height = 300,
  yAxisPrefix = "",
  yAxisSuffix = "",
  showArea = false,
}: DetailedLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity={1} />
            <stop offset="100%" stopColor={`${color}80`} stopOpacity={0.8} />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
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
        {showArea && (
          <Area type="monotone" dataKey={dataKey} stroke="none" fill="url(#areaGradient)" animationDuration={1500} />
        )}
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke="url(#lineGradient)"
          strokeWidth={3}
          dot={{ fill: color, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: color, stroke: "#fff", strokeWidth: 2 }}
          animationDuration={1500}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
