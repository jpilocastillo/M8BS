"use client"

import { BarChart, Bar, ResponsiveContainer } from "recharts"

export default function IncomeBreakdown() {
  const data = [
    { name: "Fixed Annuity", value: 198988.14 },
    { name: "AUM", value: 36003.48 },
    { name: "Financial Planning", value: 24000.0 },
  ]

  return (
    <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-6 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5">
      <h3 className="mb-6 text-center text-xl font-bold text-white">Accumulated Income</h3>
      <div className="mb-4 text-center text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
        $258,991.62
      </div>

      <div className="mb-6 h-6 overflow-hidden rounded-full">
        <ResponsiveContainer width="100%" height={24}>
          <BarChart
            data={data}
            layout="vertical"
            barCategoryGap={0}
            barGap={0}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="colorFixed" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2c7be5" stopOpacity={1} />
                <stop offset="100%" stopColor="#4d8eea" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="colorAUM" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#d8e2ef" stopOpacity={1} />
                <stop offset="100%" stopColor="#ffffff" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="colorPlanning" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#27bcfd" stopOpacity={1} />
                <stop offset="100%" stopColor="#4dcbff" stopOpacity={1} />
              </linearGradient>
            </defs>
            <Bar dataKey="value" stackId="a" fill="url(#colorFixed)" background={{ fill: "#050117" }} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-base font-bold text-[#2c7be5]">$198,988.14</div>
        </div>
        <div>
          <div className="text-sm font-medium text-[#d8e2ef]">$36,003.48</div>
        </div>
        <div>
          <div className="text-sm font-medium text-[#27bcfd]">$24,000.00</div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-gradient-to-r from-[#2c7be5] to-[#4d8eea]"></div>
          <span className="text-sm font-medium text-white">Fixed Annuity Production</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-gradient-to-r from-[#d8e2ef] to-[#ffffff]"></div>
          <span className="text-xs">AUM</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-gradient-to-r from-[#27bcfd] to-[#4dcbff]"></div>
          <span className="text-xs">Financial Planning Fees</span>
        </div>
      </div>
    </div>
  )
}
