"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface ComparisonBarChartSeries {
  dataKey: string
  name: string
  color: string
}

interface ComparisonBarChartProps {
  data: any[]
  series: ComparisonBarChartSeries[]
  height?: number
  yAxisPrefix?: string
  yAxisSuffix?: string
}

export default function ComparisonBarChart({
  data,
  series,
  height = 300,
  yAxisPrefix = "",
  yAxisSuffix = "",
}: ComparisonBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          {series.map((s, index) => (
            <linearGradient key={index} id={`gradient-${s.dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity={1} />
              <stop offset="100%" stopColor={`${s.color}80`} stopOpacity={0.8} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#215cac30" vertical={false} />
        <XAxis
          dataKey="name"
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
        <Legend
          verticalAlign="top"
          height={36}
          wrapperStyle={{ paddingBottom: "10px" }}
          formatter={(value) => <span style={{ color: "#d8e2ef" }}>{value}</span>}
        />
        {series.map((s, index) => (
          <Bar
            key={index}
            dataKey={s.dataKey}
            name={s.name}
            fill={`url(#gradient-${s.dataKey})`}
            radius={[4, 4, 0, 0]}
            barSize={20}
            animationDuration={1500}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

