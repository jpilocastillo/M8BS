"use client"

import { useState } from "react"
import { ArrowRight, BarChart2, BarChartIcon as ChartBar, Plus, TrendingUp, Users, DollarSign } from "lucide-react"
import Link from "next/link"

interface WelcomeScreenProps {
  onComplete?: () => void
  onSkip?: () => void
}

export default function WelcomeScreen({ onComplete, onSkip }: WelcomeScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "Welcome to M8B Dashboard",
      subtitle: "Your all-in-one solution for tracking and analyzing seminar performance",
      content: (
        <div className="space-y-6">
          <p className="text-[#d8e2ef] text-lg">
            M8B Dashboard helps financial advisors track and analyze their seminar marketing efforts. With our intuitive
            tools, you can:
          </p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-[#2c7be5]"></div>
              <span className="text-[#d8e2ef]">Track seminar attendance and conversion metrics</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-[#2c7be5]"></div>
              <span className="text-[#d8e2ef]">Analyze performance with interactive charts</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-[#2c7be5]"></div>
              <span className="text-[#d8e2ef]">Manage all your seminar data in one place</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-[#2c7be5]"></div>
              <span className="text-[#d8e2ef]">Generate reports to share with your team</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "Track Your Seminars",
      subtitle: "Easily record and manage all your seminar events",
      content: (
        <div className="space-y-6">
          <p className="text-[#d8e2ef] text-lg">The Data Management section allows you to:</p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-[#2c7be5]"></div>
              <span className="text-[#d8e2ef]">Add new seminar events with detailed information</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-[#2c7be5]"></div>
              <span className="text-[#d8e2ef]">Track attendance, appointments, and client conversions</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-[#2c7be5]"></div>
              <span className="text-[#d8e2ef]">Monitor revenue generated from each seminar</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-[#2c7be5]"></div>
              <span className="text-[#d8e2ef]">Export your data for reporting and analysis</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "Analyze Performance",
      subtitle: "Gain insights with powerful analytics tools",
      content: (
        <div className="space-y-6">
          <p className="text-[#d8e2ef] text-lg">The Analytics dashboard provides powerful insights:</p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-[#2c7be5]"></div>
              <span className="text-[#d8e2ef]">Compare performance across multiple seminars</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-[#2c7be5]"></div>
              <span className="text-[#d8e2ef]">Identify trends in attendance and conversion rates</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-[#2c7be5]"></div>
              <span className="text-[#d8e2ef]">Visualize revenue and ROI metrics</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-[#2c7be5]"></div>
              <span className="text-[#d8e2ef]">Make data-driven decisions for future seminars</span>
            </li>
          </ul>

          {/* Dashboard Preview */}
          <div className="mt-8 border border-[#215cac]/40 rounded-lg overflow-hidden shadow-lg">
            <div className="bg-[#050117] p-3 border-b border-[#215cac]/40 flex items-center">
              <div className="h-3 w-3 rounded-full bg-[#e63757] mr-2"></div>
              <div className="h-3 w-3 rounded-full bg-[#f7c46c] mr-2"></div>
              <div className="h-3 w-3 rounded-full bg-[#00d27a] mr-2"></div>
              <div className="flex-1 text-center text-xs text-[#5e6e82]">Marketing Dashboard Preview</div>
            </div>
            <div className="bg-[#050117]/80 p-4">
              {/* Dashboard Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Marketing Analytics Dashboard</h3>
                  <p className="text-xs text-[#5e6e82]">Last updated: Today</p>
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-[#215cac]/20 rounded"></div>
                  <div className="h-6 w-6 bg-[#215cac]/20 rounded"></div>
                </div>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  { icon: <TrendingUp size={14} />, value: "274%", label: "ROI" },
                  { icon: <Users size={14} />, value: "7.1%", label: "Conversion" },
                  { icon: <DollarSign size={14} />, value: "$258k", label: "Revenue" },
                  { icon: <ChartBar size={14} />, value: "28", label: "Events" },
                ].map((metric, i) => (
                  <div key={i} className="bg-[#0a0a29] p-2 rounded border border-[#215cac]/20">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-[#5e6e82]">{metric.label}</span>
                      <span className="text-[#2c7be5]">{metric.icon}</span>
                    </div>
                    <div className="text-sm font-bold text-white">{metric.value}</div>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Bar Chart */}
                <div className="bg-[#0a0a29] p-3 rounded border border-[#215cac]/20">
                  <div className="text-xs font-bold text-white mb-2">Revenue by Event</div>
                  <div className="h-20 flex items-end gap-1">
                    {[40, 65, 30, 80, 55, 75, 45, 60].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-[#2c7be5] to-[#27bcfd]"
                        style={{ height: `${height}%` }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Line Chart */}
                <div className="bg-[#0a0a29] p-3 rounded border border-[#215cac]/20">
                  <div className="text-xs font-bold text-white mb-2">Conversion Rate Trend</div>
                  <div className="h-20 relative">
                    <div className="absolute inset-0 flex items-center">
                      <svg className="w-full h-12" viewBox="0 0 100 20">
                        <path
                          d="M0,10 L12,8 L25,12 L37,6 L50,14 L62,4 L75,10 L87,2 L100,7"
                          fill="none"
                          stroke="url(#lineGradient)"
                          strokeWidth="2"
                        />
                        <defs>
                          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#2c7be5" />
                            <stop offset="100%" stopColor="#27bcfd" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="bg-[#0a0a29] rounded border border-[#215cac]/20 overflow-hidden">
                <div className="text-xs font-bold text-white p-2 border-b border-[#215cac]/20">
                  Top Performing Events
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[#050117]/50">
                      <th className="p-1 text-left text-[#5e6e82]">Event</th>
                      <th className="p-1 text-right text-[#5e6e82]">ROI</th>
                      <th className="p-1 text-right text-[#5e6e82]">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Retirement Planning", roi: "310%", revenue: "$280K" },
                      { name: "Tax Strategies", roi: "285%", revenue: "$240K" },
                      { name: "Estate Planning", roi: "274%", revenue: "$259K" },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-[#215cac]/10">
                        <td className="p-1 text-white">{row.name}</td>
                        <td className="p-1 text-right text-[#00d27a]">{row.roi}</td>
                        <td className="p-1 text-right text-white">{row.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Get Started",
      subtitle: "Choose how you want to begin using M8B Dashboard",
      content: (
        <div className="flex justify-center mt-8">
          <div className="bg-[#050117]/50 p-6 rounded-lg border border-[#215cac]/20 hover:border-[#2c7be5]/40 transition-all duration-300 text-center group max-w-sm">
            <div className="mb-4 h-16 w-16 rounded-full bg-[#215cac]/20 flex items-center justify-center mx-auto group-hover:bg-[#2c7be5]/20 transition-colors">
              <Plus className="h-8 w-8 text-[#2c7be5]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Add Your First Event</h3>
            <p className="text-[#d8e2ef] mb-4 text-sm">
              Enter details about your marketing events to start tracking performance.
            </p>
            <Link
              href="/data-management/new"
              className="inline-flex items-center gap-2 text-[#2c7be5] hover:text-[#27bcfd] transition-colors"
            >
              <span>Add Event Data</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ),
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      if (onComplete) {
        onComplete()
      }
    }
  }

  const handleSkip = () => {
    if (onSkip) {
      onSkip()
    } else if (onComplete) {
      onComplete()
    }
  }

  const currentStepData = steps[currentStep]

  return (
    <div className="min-h-screen bg-[#050117] flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-[#0a0a29]/90 rounded-lg border border-[#215cac]/20 shadow-xl">
        {/* Progress indicator */}
        <div className="flex justify-center pt-8">
          <div className="flex items-center gap-3">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  index === currentStep ? "bg-[#2c7be5]" : "bg-[#215cac]/40"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-8 md:p-12">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="h-24 w-24 rounded-full bg-[#050117]/80 border border-[#215cac]/30 flex items-center justify-center">
              <BarChart2 className="h-12 w-12 text-[#2c7be5]" />
            </div>
          </div>

          {/* Title and subtitle */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white mb-3">{currentStepData.title}</h1>
            <p className="text-xl text-[#d8e2ef]/80">{currentStepData.subtitle}</p>
          </div>

          {/* Content */}
          <div className="mb-12">{currentStepData.content}</div>

          {/* Navigation buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {currentStep < steps.length - 1 ? (
              <>
                <button
                  onClick={handleNext}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-[#2c7be5] text-white rounded-md font-bold hover:bg-[#27bcfd] transition-colors"
                >
                  Next <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  onClick={handleSkip}
                  className="px-8 py-3 bg-[#050117]/50 text-white rounded-md font-bold hover:bg-[#050117]/80 transition-colors"
                >
                  Skip Tour
                </button>
              </>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-[#2c7be5] text-white rounded-md font-bold hover:bg-[#27bcfd] transition-colors"
              >
                Get Started <ArrowRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
