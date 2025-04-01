"use client"

import { TrendingUp, TrendingDown, Users, DollarSign, BarChart2 } from "lucide-react"

interface AggregateMetricsProps {
  events: any[]
}

export default function AggregateMetrics({ events }: AggregateMetricsProps) {
  // Calculate aggregate metrics
  const totalEvents = events.length
  const totalAttendees = events.reduce((sum, event) => sum + event.attendees, 0)
  const totalClients = events.reduce((sum, event) => sum + event.clients, 0)
  const totalRevenue = events.reduce((sum, event) => sum + event.revenue, 0)
  const totalExpenses = events.reduce((sum, event) => sum + event.expenses, 0)

  // Calculate averages
  const avgROI = events.length > 0 ? events.reduce((sum, event) => sum + event.roi, 0) / events.length : 0

  const avgConversionRate =
    events.length > 0 ? events.reduce((sum, event) => sum + event.conversionRate, 0) / events.length : 0

  const clientAcquisitionCost = totalClients > 0 ? totalExpenses / totalClients : 0

  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#5e6e82]">Total Events</p>
            <h3 className="text-3xl font-bold text-white">{totalEvents}</h3>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#2c7be5]/20 flex items-center justify-center">
            <BarChart2 className="h-5 w-5 text-[#2c7be5]" />
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#5e6e82]">Total Attendees</p>
            <h3 className="text-3xl font-bold text-white">{totalAttendees}</h3>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#27bcfd]/20 flex items-center justify-center">
            <Users className="h-5 w-5 text-[#27bcfd]" />
          </div>
        </div>
        <div className="mt-2 text-xs text-[#5e6e82]">
          Avg {(totalAttendees / Math.max(1, totalEvents)).toFixed(1)} per event
        </div>
      </div>

      <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#5e6e82]">Total Revenue</p>
            <h3 className="text-3xl font-bold text-white">${totalRevenue.toLocaleString()}</h3>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#00d27a]/20 flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-[#00d27a]" />
          </div>
        </div>
        <div className="mt-2 text-xs text-[#5e6e82]">
          Avg ${(totalRevenue / Math.max(1, totalEvents)).toLocaleString()} per event
        </div>
      </div>

      <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#5e6e82]">Avg ROI</p>
            <h3 className="text-3xl font-bold text-white">{avgROI.toFixed(1)}%</h3>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#e63757]/20 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-[#e63757]" />
          </div>
        </div>
        <div className="mt-2 text-xs text-[#5e6e82]">
          {avgROI > 250 ? (
            <span className="flex items-center text-[#00d27a]">
              <TrendingUp className="h-3 w-3 mr-1" /> Above target
            </span>
          ) : (
            <span className="flex items-center text-[#e63757]">
              <TrendingDown className="h-3 w-3 mr-1" /> Below target
            </span>
          )}
        </div>
      </div>

      <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#5e6e82]">Avg Conversion</p>
            <h3 className="text-3xl font-bold text-white">{avgConversionRate.toFixed(1)}%</h3>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#748194]/20 flex items-center justify-center">
            <Users className="h-5 w-5 text-[#748194]" />
          </div>
        </div>
        <div className="mt-2 text-xs text-[#5e6e82]">
          {totalClients} clients from {totalAttendees} attendees
        </div>
      </div>
    </div>
  )
}

