"use client"

import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Label } from "recharts"

interface PieChartProps {
  data: any[]
  dataKey: string
  nameKey: string
  colorKey: string
  size?: number
  donut?: boolean
  centerText?: string
  showLabels?: boolean
}

export default function PieChart({
  data,
  dataKey,
  nameKey,
  colorKey,
  size = 300,
  donut = false,
  centerText,
  showLabels = false,
}: PieChartProps) {
  const innerRadius = donut ? size / 3 : 0
  const outerRadius = size / 2.5

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey={dataKey}
            nameKey={nameKey}
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry[colorKey]} />
            ))}
            {showLabels && (
              <Label
                position="outside"
                offset={20}
                content={({ viewBox }) => {
                  const { cx, cy } = viewBox as { cx: number; cy: number }
                  return (
                    <g>
                      {data.map((entry, index) => {
                        const angle = (index / data.length) * 2 * Math.PI
                        const x = cx + (outerRadius + 30) * Math.cos(angle)
                        const y = cy + (outerRadius + 30) * Math.sin(angle)
                        return (
                          <text
                            key={index}
                            x={x}
                            y={y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#d8e2ef"
                            fontSize={12}
                          >
                            {entry[nameKey]}
                          </text>
                        )
                      })}
                    </g>
                  )
                }}
              />
            )}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#0a0a29",
              borderColor: "#215cac50",
              borderRadius: "0.375rem",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            }}
            itemStyle={{ color: "#fff" }}
            formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]}
            labelStyle={{ color: "#5e6e82", fontWeight: "bold", marginBottom: "0.5rem" }}
          />
          {!showLabels && (
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span style={{ color: "#d8e2ef" }}>{value}</span>}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
      {centerText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
            {centerText}
          </span>
        </div>
      )}
    </div>
  )
}

