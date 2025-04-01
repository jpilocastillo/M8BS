"use client"

import { LineChart as RechartsLineChart, Line, ResponsiveContainer } from "recharts"

interface LineChartProps {
  data: any[]
  dataKey: string
  color?: string
  height?: number
  strokeWidth?: number
}

export default function LineChart({ data, dataKey, color = "#2c7be5", height = 50, strokeWidth = 2 }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity={1} />
            <stop offset="100%" stopColor={`${color}80`} stopOpacity={0.8} />
          </linearGradient>
        </defs>
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke="url(#lineGradient)"
          strokeWidth={strokeWidth}
          dot={false}
          activeDot={{ r: 4, fill: color }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

