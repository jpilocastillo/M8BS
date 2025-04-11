"use client"

import {
  RadialBarChart as RechartsRadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  PolarAngleAxis,
  Tooltip,
} from "recharts"

interface RadialBarChartProps {
  data: any[]
  height?: number
  innerRadius?: number
  outerRadius?: number
}

export default function RadialBarChart({
  data,
  height = 300,
  innerRadius = 60,
  outerRadius = 120,
}: RadialBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsRadialBarChart
        cx="50%"
        cy="50%"
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        barSize={20}
        data={data}
        startAngle={180}
        endAngle={-180}
      >
        <PolarAngleAxis type="number" domain={[0, 300]} angleAxisId={0} tick={false} />
        <RadialBar
          background
          dataKey="value"
          angleAxisId={0}
          fill="#8884d8"
          label={{
            position: "insideStart",
            fill: "#fff",
            fontSize: 14,
            formatter: (value: number) => `${value}%`,
          }}
        >
          {data.map((entry, index) => (
            <cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </RadialBar>
        <Tooltip
          contentStyle={{
            backgroundColor: "#0a0a29",
            borderColor: "#215cac50",
            borderRadius: "0.375rem",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          }}
          itemStyle={{ color: "#fff" }}
          formatter={(value) => [`${value}%`, ""]}
          labelStyle={{ color: "#5e6e82", fontWeight: "bold", marginBottom: "0.5rem" }}
        />
        <Legend
          iconSize={10}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{ paddingTop: "20px" }}
          formatter={(value) => <span style={{ color: "#d8e2ef" }}>{value}</span>}
        />
      </RechartsRadialBarChart>
    </ResponsiveContainer>
  )
}
