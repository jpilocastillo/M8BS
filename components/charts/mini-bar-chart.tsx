interface MiniBarChartProps {
  data: number[]
  color?: string
  height?: number
}

export default function MiniBarChart({ data, color = "#2c7be5", height = 32 }: MiniBarChartProps) {
  const gradientFrom = color
  let gradientTo = color

  if (color === "#2c7be5") {
    gradientTo = "#4d8eea"
  } else if (color === "#e63757") {
    gradientTo = "#ff6b84"
  } else if (color === "#748194") {
    gradientTo = "#9aa8b9"
  }

  return (
    <div className="flex h-8 items-end justify-center gap-1" style={{ height }}>
      {data.map((value, i) => (
        <div
          key={i}
          className="w-1 rounded-t-sm"
          style={{
            height: `${value * 100}%`,
            background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`,
          }}
        ></div>
      ))}
    </div>
  )
}
