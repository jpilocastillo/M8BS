"use client"

import { ArrowRight, BarChart2, PlusCircle } from "lucide-react"
import Link from "next/link"

export default function EmptyDashboardState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-6 h-24 w-24 rounded-full bg-[#050117]/80 border border-[#215cac]/30 flex items-center justify-center">
        <BarChart2 className="h-12 w-12 text-[#2c7be5]" />
      </div>

      <h2 className="text-4xl font-bold text-white mb-4">Welcome to Your Marketing Dashboard</h2>
      <p className="text-xl text-[#d8e2ef]/80 max-w-2xl mb-12">
        Track, analyze, and optimize your marketing events to maximize ROI and client conversions. Get started by adding
        your first marketing event data.
      </p>

      <div className="flex justify-center max-w-4xl w-full mb-16">
        <div className="bg-[#050117]/50 p-8 rounded-lg border border-[#215cac]/20 text-center hover:border-[#2c7be5]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#2c7be5]/5 group max-w-md">
          <div className="mb-4 h-16 w-16 rounded-full bg-[#215cac]/20 flex items-center justify-center mx-auto group-hover:bg-[#2c7be5]/20 transition-colors">
            <PlusCircle className="h-8 w-8 text-[#2c7be5]" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Add Your First Event</h3>
          <p className="text-[#d8e2ef]/80 mb-4">
            Enter details about your marketing events to start tracking performance.
          </p>
          <Link
            href="/data-management/new"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2c7be5] to-[#27bcfd] text-white rounded-md font-bold hover:opacity-90 transition-opacity"
          >
            <span>Add Event Data</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className="bg-[#050117]/50 border border-[#215cac]/20 rounded-lg p-8 max-w-4xl w-full">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">What You'll See When You Add Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex items-start gap-4">
            <div className="h-8 w-8 rounded-full bg-[#215cac]/20 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-[#2c7be5] font-bold">1</span>
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-2">Performance Metrics</h4>
              <p className="text-[#d8e2ef]/80">
                Track ROI, conversion rates, and revenue across all your marketing events.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-8 w-8 rounded-full bg-[#215cac]/20 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-[#27bcfd] font-bold">2</span>
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-2">Top Performers</h4>
              <p className="text-[#d8e2ef]/80">Identify your most successful events, topics, and locations.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-8 w-8 rounded-full bg-[#215cac]/20 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-[#00d27a] font-bold">3</span>
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-2">Performance Heatmap</h4>
              <p className="text-[#d8e2ef]/80">Visualize which combinations of topics and locations perform best.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-8 w-8 rounded-full bg-[#215cac]/20 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-[#e63757] font-bold">4</span>
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-2">Filtering & Analysis</h4>
              <p className="text-[#d8e2ef]/80">Filter by date, topic, and location to drill down into specific data.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

