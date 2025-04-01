import type { ReactNode } from "react"

interface MetricCardProps {
  title: string
  value: string
  chart: ReactNode
  legend?: ReactNode
}

export default function MetricCard({ title, value, chart, legend }: MetricCardProps) {
  return (
    <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 backdrop-blur-sm transition-all duration-300 hover:shadow-[#2c7be5]/10">
      <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
      <div className="flex items-center justify-between gap-4">
        <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
          {value}
        </div>
        <div className="flex-shrink-0">{chart}</div>
      </div>
      {legend && <div className="mt-1">{legend}</div>}
    </div>
  )
}

