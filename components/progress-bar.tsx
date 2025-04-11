interface ProgressBarProps {
  value: number
  color?: string
}

export default function ProgressBar({ value, color = "#2c7be5" }: ProgressBarProps) {
  let gradientFrom = "#2c7be5"
  let gradientTo = "#27bcfd"

  if (color === "#e63757") {
    gradientFrom = "#e63757"
    gradientTo = "#ff6b84"
  } else if (color === "#00d27a") {
    gradientFrom = "#00d27a"
    gradientTo = "#4aeaa0"
  }

  return (
    <div className="h-2 w-full rounded-full bg-[#050117]/50 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500 ease-out"
        style={{
          width: `${value}%`,
          background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
          boxShadow: `0 0 10px ${gradientFrom}80`,
        }}
      ></div>
    </div>
  )
}
