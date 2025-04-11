"use client"

import type React from "react"

import { useState, useCallback } from "react"
import SideNav from "./side-nav"
import MetricCard from "./metric-card"
import EventDetails from "./event-details"
import DateFilter from "./date-filter"
import EmptyStateWidget from "./empty-state-widget"
import { useDateSelection, DateSelectionProvider } from "@/contexts/date-selection-context"
// Import the EmptyDashboardState component at the top of the file
import EmptyDashboardState from "./empty-dashboard-state"
import { BarChart2 } from "lucide-react"

// Sample data for different events
const eventData = {
  all: {
    roi: 274,
    writtenBusiness: 2,
    income: 258991,
    conversionRate: 7.1,
    expenses: {
      advertising: 5320.52,
      foodVenue: 2551.5,
      total: 7872.02,
    },
    attendees: 28,
    clients: 2,
    registrantResponses: 31,
    confirmations: 28,
    responseRate: 0.31,
    confirmationRate: 90.3,
    attendanceRate: 100,
    topic: "Retirement Outlook",
    annuitiesSold: 2,
    lifePoliciesSold: 0,
    financialProduction: {
      fixedAnnuity: 80000,
      lifeInsurance: 11000,
      aum: 490839,
      planning: 12000,
      total: 593839,
    },
    accumulatedIncome: {
      fixedAnnuity: 198988.14,
      aum: 36003.48,
      planning: 24000,
      total: 258991.62,
    },
    audienceTotal: 10000,
  },
  "event-1": {
    roi: 220,
    writtenBusiness: 1,
    income: 180000,
    conversionRate: 5.2,
    expenses: {
      advertising: 4200,
      foodVenue: 2100,
      total: 6300,
    },
    attendees: 19,
    clients: 1,
    registrantResponses: 25,
    confirmations: 22,
    responseRate: 0.25,
    confirmationRate: 88.0,
    attendanceRate: 86.4,
    topic: "Retirement Planning",
    annuitiesSold: 1,
    lifePoliciesSold: 0,
    financialProduction: {
      fixedAnnuity: 65000,
      lifeInsurance: 0,
      aum: 320000,
      planning: 8000,
      total: 393000,
    },
    accumulatedIncome: {
      fixedAnnuity: 150000,
      aum: 25000,
      planning: 15000,
      total: 190000,
    },
    audienceTotal: 10000,
  },
  "event-2": {
    roi: 245,
    writtenBusiness: 2,
    income: 210000,
    conversionRate: 6.5,
    expenses: {
      advertising: 4800,
      foodVenue: 2300,
      total: 7100,
    },
    attendees: 31,
    clients: 2,
    registrantResponses: 35,
    confirmations: 32,
    responseRate: 0.35,
    confirmationRate: 91.4,
    attendanceRate: 96.9,
    topic: "Tax Strategies",
    annuitiesSold: 2,
    lifePoliciesSold: 0,
    financialProduction: {
      fixedAnnuity: 95000,
      lifeInsurance: 0,
      aum: 420000,
      planning: 10000,
      total: 525000,
    },
    accumulatedIncome: {
      fixedAnnuity: 180000,
      aum: 30000,
      planning: 18000,
      total: 228000,
    },
    audienceTotal: 10000,
  },
  "event-3": {
    roi: 198,
    writtenBusiness: 1,
    income: 150000,
    conversionRate: 4.8,
    expenses: {
      advertising: 4500,
      foodVenue: 2200,
      total: 6700,
    },
    attendees: 21,
    clients: 1,
    registrantResponses: 28,
    confirmations: 24,
    responseRate: 0.28,
    confirmationRate: 85.7,
    attendanceRate: 87.5,
    topic: "Estate Planning",
    annuitiesSold: 1,
    lifePoliciesSold: 0,
    financialProduction: {
      fixedAnnuity: 60000,
      lifeInsurance: 0,
      aum: 280000,
      planning: 7000,
      total: 347000,
    },
    accumulatedIncome: {
      fixedAnnuity: 130000,
      aum: 20000,
      planning: 12000,
      total: 162000,
    },
    audienceTotal: 10000,
  },
  "event-4": {
    roi: 310,
    writtenBusiness: 3,
    income: 280000,
    conversionRate: 8.1,
    expenses: {
      advertising: 5100,
      foodVenue: 2600,
      total: 7700,
    },
    attendees: 37,
    clients: 3,
    registrantResponses: 42,
    confirmations: 39,
    responseRate: 0.42,
    confirmationRate: 92.9,
    attendanceRate: 94.9,
    topic: "Retirement Income",
    annuitiesSold: 3,
    lifePoliciesSold: 1,
    financialProduction: {
      fixedAnnuity: 120000,
      lifeInsurance: 25000,
      aum: 550000,
      planning: 15000,
      total: 710000,
    },
    accumulatedIncome: {
      fixedAnnuity: 220000,
      aum: 40000,
      planning: 22000,
      total: 282000,
    },
    audienceTotal: 10000,
  },
  "event-5": {
    roi: 265,
    writtenBusiness: 2,
    income: 230000,
    conversionRate: 7.4,
    expenses: {
      advertising: 4900,
      foodVenue: 2400,
      total: 7300,
    },
    attendees: 27,
    clients: 2,
    registrantResponses: 32,
    confirmations: 29,
    responseRate: 0.32,
    confirmationRate: 90.6,
    attendanceRate: 93.1,
    topic: "Social Security",
    annuitiesSold: 2,
    lifePoliciesSold: 0,
    financialProduction: {
      fixedAnnuity: 85000,
      lifeInsurance: 0,
      aum: 460000,
      planning: 12000,
      total: 557000,
    },
    accumulatedIncome: {
      fixedAnnuity: 190000,
      aum: 32000,
      planning: 20000,
      total: 242000,
    },
    audienceTotal: 10000,
  },
  "event-6": {
    roi: 285,
    writtenBusiness: 2,
    income: 240000,
    conversionRate: 7.7,
    expenses: {
      advertising: 5000,
      foodVenue: 2500,
      total: 7500,
    },
    attendees: 26,
    clients: 2,
    registrantResponses: 30,
    confirmations: 27,
    responseRate: 0.3,
    confirmationRate: 90.0,
    attendanceRate: 96.3,
    topic: "Retirement Outlook",
    annuitiesSold: 2,
    lifePoliciesSold: 0,
    financialProduction: {
      fixedAnnuity: 90000,
      lifeInsurance: 0,
      aum: 470000,
      planning: 11000,
      total: 571000,
    },
    accumulatedIncome: {
      fixedAnnuity: 195000,
      aum: 33000,
      planning: 21000,
      total: 249000,
    },
    audienceTotal: 10000,
  },
  "event-7": {
    roi: 225,
    writtenBusiness: 1,
    income: 190000,
    conversionRate: 5.5,
    expenses: {
      advertising: 4300,
      foodVenue: 2200,
      total: 6500,
    },
    attendees: 18,
    clients: 1,
    registrantResponses: 22,
    confirmations: 19,
    responseRate: 0.22,
    confirmationRate: 86.4,
    attendanceRate: 94.7,
    topic: "Tax Strategies",
    annuitiesSold: 1,
    lifePoliciesSold: 0,
    financialProduction: {
      fixedAnnuity: 70000,
      lifeInsurance: 0,
      aum: 310000,
      planning: 8000,
      total: 388000,
    },
    accumulatedIncome: {
      fixedAnnuity: 160000,
      aum: 22000,
      planning: 14000,
      total: 196000,
    },
    audienceTotal: 10000,
  },
  "event-8": {
    roi: 250,
    writtenBusiness: 2,
    income: 220000,
    conversionRate: 6.8,
    expenses: {
      advertising: 4700,
      foodVenue: 2300,
      total: 7000,
    },
    attendees: 29,
    clients: 2,
    registrantResponses: 34,
    confirmations: 31,
    responseRate: 0.34,
    confirmationRate: 91.2,
    attendanceRate: 93.5,
    topic: "Estate Planning",
    annuitiesSold: 2,
    lifePoliciesSold: 0,
    financialProduction: {
      fixedAnnuity: 80000,
      lifeInsurance: 0,
      aum: 440000,
      planning: 10000,
      total: 530000,
    },
    accumulatedIncome: {
      fixedAnnuity: 185000,
      aum: 28000,
      planning: 17000,
      total: 230000,
    },
    audienceTotal: 10000,
  },
  "event-9": {
    roi: 274,
    writtenBusiness: 2,
    income: 258991,
    conversionRate: 7.1,
    expenses: {
      advertising: 5320.52,
      foodVenue: 2551.5,
      total: 7872.02,
    },
    attendees: 28,
    clients: 2,
    registrantResponses: 31,
    confirmations: 28,
    responseRate: 0.31,
    confirmationRate: 90.3,
    attendanceRate: 100,
    topic: "Retirement Outlook",
    annuitiesSold: 2,
    lifePoliciesSold: 0,
    financialProduction: {
      fixedAnnuity: 80000,
      lifeInsurance: 11000,
      aum: 490839,
      planning: 12000,
      total: 593839,
    },
    accumulatedIncome: {
      fixedAnnuity: 198988.14,
      aum: 36003.48,
      planning: 24000,
      total: 258991.62,
    },
    audienceTotal: 10000,
  },
}

export function Dashboard() {
  // State to track if data is available
  const [hasData, setHasData] = useState(true)
  const { selectedDate } = useDateSelection()

  // Get data for the selected date
  const getSelectedData = useCallback(() => {
    return eventData[selectedDate] || eventData.all
  }, [selectedDate])

  const selectedData = getSelectedData()

  // Sample data for charts
  const roiData = [
    { name: "Jan", value: 60 },
    { name: "Feb", value: 80 },
    { name: "Mar", value: 70 },
    { name: "Apr", value: 90 },
    { name: "May", value: 75 },
    { name: "Jun", value: 85 },
  ]

  const businessData = [
    { name: "Jan", value: 1 },
    { name: "Feb", value: 2 },
    { name: "Mar", value: 1.5 },
    { name: "Apr", value: 2 },
    { name: "May", value: 2.5 },
    { name: "Jun", value: 2 },
  ]

  const fixedAnnuityData = [0.3, 0.5, 0.7, 0.4, 0.6, 0.8, 0.5, 0.7, 0.9]
  const lifeInsuranceData = [0.1, 0.2, 0.1, 0.3, 0.1, 0.2, 0.1, 0.2, 0.1]
  const aumData = [0.6, 0.4, 0.7, 0.5, 0.8, 0.6, 0.9, 0.7, 0.8]

  // Client acquisition cost data
  const acquisitionData = [
    {
      name: "Expense per Buying Unit",
      value: selectedData.expenses.total / selectedData.attendees,
      color: "#2c7be5",
      percentage: 7.1,
    },
    {
      name: "Expense per 1st Appointment",
      value: selectedData.expenses.total / Math.max(1, Math.round(selectedData.attendees * 0.14)),
      color: "#27bcfd",
      percentage: 33.3,
    },
    {
      name: "Expense per Client",
      value: selectedData.expenses.total / selectedData.clients,
      color: "#00d27a",
      percentage: 59.6,
    },
  ]

  // Appointment trends data - dynamically calculated from selectedData
  const appointmentData = [
    {
      label: "Set at Event",
      value: Math.round(selectedData.attendees * 0.14),
      color: "#2c7be5",
    },
    {
      label: "Set After Event",
      value: Math.round(selectedData.attendees * 0.07),
      color: "#e63757",
    },
    {
      label: "1st Appt. Attended",
      value: Math.round(selectedData.attendees * 0.14),
      color: "#27bcfd",
    },
    {
      label: "1st Appt. No Shows",
      value: Math.round(selectedData.attendees * 0.07),
      color: "#00d27a",
    },
    {
      label: "2nd Appt. Attended",
      value: Math.round(selectedData.attendees * 0.14),
      color: "#748194",
    },
  ]

  // Function to render widget content based on data availability
  const renderWidgetContent = (widgetName: string, content: React.ReactNode) => {
    if (!hasData) {
      return (
        <EmptyStateWidget
          title={`No ${widgetName} Data Available`}
          message="Add marketing event data to see insights here"
        />
      )
    }
    return content
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#050117] to-[#0a0a29] text-white">
      <SideNav />
      {/* Check if there's any data */}
      {Object.keys(eventData).length <= 1 ? ( // Only "all" key means no real data
        <main className="flex-1 p-6">
          <EmptyDashboardState />
        </main>
      ) : (
        <main className="flex-1 p-6">
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <BarChart2 className="h-6 w-6 text-[#2c7be5]" />
              <h1 className="text-3xl font-bold text-white">
                Welcome to Your
                <br />
                <span className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
                  M8BS Marketing Dashboard
                </span>
              </h1>
            </div>
            <DateFilter />
          </div>

          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="ROI"
              value={`${selectedData.roi}%`}
              chart={renderWidgetContent(
                "ROI",
                <div className="relative h-14 w-full flex items-center justify-center">
                  {/* Vertical bars visualization - contained within widget */}
                  <div className="flex h-10 items-end gap-1.5 px-2">
                    {[0.7, 0.5, 0.9, 0.6, 0.8, 0.5, 0.7].map((height, i) => (
                      <div
                        key={i}
                        className={`w-1.5 rounded-t-sm ${
                          i % 2 === 0 ? "bg-white" : "bg-gradient-to-t from-[#2c7be5] to-[#27bcfd]"
                        }`}
                        style={{ height: `${height * 100}%` }}
                      />
                    ))}
                  </div>
                </div>,
              )}
            />
            <MetricCard
              title="Written Business"
              value={selectedData.writtenBusiness.toString()}
              chart={renderWidgetContent(
                "Written Business",
                <div className="w-full h-full flex items-center justify-center">
                  {/* Document - larger size without pen or number */}
                  <div className="relative w-16 h-20 bg-gradient-to-br from-[#2c7be5] to-[#27bcfd] rounded-md shadow-lg">
                    {/* Document corner fold */}
                    <div className="absolute top-0 right-0 w-0 h-0 border-t-[6px] border-r-[6px] border-t-[#4dcbff] border-r-[#4dcbff]"></div>

                    {/* Document lines */}
                    <div className="absolute top-5 left-2 right-2 h-0.5 bg-white opacity-50 rounded-full"></div>
                    <div className="absolute top-9 left-2 right-2 h-0.5 bg-white opacity-50 rounded-full"></div>
                    <div className="absolute top-13 left-2 right-2 h-0.5 bg-white opacity-50 rounded-full"></div>
                    <div className="absolute top-17 left-2 right-2 h-0.5 bg-white opacity-50 rounded-full"></div>
                  </div>
                </div>,
              )}
            />
            <MetricCard
              title="Accumulative Income"
              value={`$${selectedData.income.toLocaleString()}`}
              chart={renderWidgetContent(
                "Income",
                <div className="relative h-16 w-16">
                  <svg viewBox="0 0 36 36" className="h-full w-full">
                    <defs>
                      <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2c7be5" />
                        <stop offset="100%" stopColor="#4d8eea" />
                      </linearGradient>
                    </defs>
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#050117" strokeWidth="2" />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9"
                      fill="none"
                      stroke="url(#circleGradient)"
                      strokeWidth="2.5"
                      strokeDasharray="100"
                      strokeDashoffset="25"
                      transform="rotate(-90 18 18)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold">75%</span>
                  </div>
                </div>,
              )}
              legend={
                <div className="mt-1 flex flex-wrap gap-1.5 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-[#2c7be5]"></div>
                    <span>Fixed Annuity</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-[#e63757]"></div>
                    <span>Life</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-[#748194]"></div>
                    <span>AUM</span>
                  </div>
                </div>
              }
            />
            <MetricCard
              title="% of Attendees Becoming Clients"
              value={`${selectedData.conversionRate}%`}
              chart={renderWidgetContent(
                "Conversion",
                <div className="relative h-16 w-16">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#27bcfd]"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <svg viewBox="0 0 36 36" className="h-full w-full">
                    <defs>
                      <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#27bcfd" />
                        <stop offset="100%" stopColor="#4dcbff" />
                      </linearGradient>
                      <filter id="peopleGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="1.5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    <circle cx="18" cy="18" r="16" fill="#050117" />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#215cac30"
                      strokeWidth="2"
                      strokeDasharray="100, 100"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="url(#gaugeGradient)"
                      strokeWidth="2.5"
                      strokeDasharray={`${selectedData.conversionRate}, 100`}
                      transform="rotate(180 18 18)"
                      filter="url(#peopleGlow)"
                    />
                  </svg>
                </div>,
              )}
              legend={
                <div className="mt-1 flex items-center gap-1.5 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-[#27bcfd]"></div>
                    <span>
                      {selectedData.attendees} Attendees → {selectedData.clients} Clients
                    </span>
                  </div>
                </div>
              }
            />
          </div>

          <EventDetails />

          <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Marketing Expenses - First column */}
            <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-5 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 backdrop-blur-sm transition-all duration-300 hover:shadow-[#2c7be5]/10 h-full flex flex-col">
              <h3 className="mb-3 text-center text-2xl font-bold text-white">Marketing Expenses</h3>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex-1 flex items-center justify-center py-4">
                  <div className="relative h-56 w-56">
                    <svg viewBox="0 0 100 100" className="h-full w-full">
                      <defs>
                        <linearGradient id="expenseGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#2c7be5" />
                          <stop offset="100%" stopColor="#27bcfd" />
                        </linearGradient>
                        <linearGradient id="expenseGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#00d27a" />
                          <stop offset="100%" stopColor="#4aeaa0" />
                        </linearGradient>
                      </defs>
                      {/* Background circle */}
                      <circle cx="50" cy="50" r="40" fill="#050117" />

                      {/* Calculate percentages for the current data */}
                      {(() => {
                        const adPercent = (selectedData.expenses.advertising / selectedData.expenses.total) * 100
                        const foodPercent = (selectedData.expenses.foodVenue / selectedData.expenses.total) * 100

                        return (
                          <>
                            {/* Pie chart segments */}
                            <path
                              d="M50 10 A40 40 0 0 1 90 50 A40 40 0 0 1 50 90 A40 40 0 0 1 10 50 A40 40 0 0 1 50 10 z"
                              fill="none"
                              stroke="url(#expenseGradient1)"
                              strokeWidth="15"
                              strokeDasharray={`${adPercent * 2.512} 251.2`}
                              strokeDashoffset="0"
                            />
                            <path
                              d="M50 10 A40 40 0 0 1 90 50 A40 40 0 0 1 50 90 A40 40 0 0 1 10 50 A40 40 0 0 1 50 10 z"
                              fill="none"
                              stroke="url(#expenseGradient2)"
                              strokeWidth="15"
                              strokeDasharray={`${foodPercent * 2.512} 251.2`}
                              strokeDashoffset={`-${adPercent * 2.512}`}
                            />
                          </>
                        )
                      })()}

                      {/* Center text */}
                      <text
                        x="50"
                        y="50"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize="14"
                        fontWeight="bold"
                      >
                        ${selectedData.expenses.total.toLocaleString()}
                      </text>
                    </svg>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="bg-[#050117]/50 p-3 rounded-md">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-4 w-4 rounded-full bg-gradient-to-r from-[#2c7be5] to-[#27bcfd]"></div>
                      <span className="text-sm font-medium text-white">Advertising Cost</span>
                    </div>
                    <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
                      ${selectedData.expenses.advertising.toLocaleString()}
                    </div>
                    <div className="mt-1 text-xs text-[#5e6e82]">
                      {Math.round((selectedData.expenses.advertising / selectedData.expenses.total) * 100)}% of total
                    </div>
                  </div>

                  <div className="bg-[#050117]/50 p-3 rounded-md">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-4 w-4 rounded-full bg-gradient-to-r from-[#00d27a] to-[#4aeaa0]"></div>
                      <span className="text-sm font-medium text-white">Food/Venue Cost</span>
                    </div>
                    <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
                      ${selectedData.expenses.foodVenue.toLocaleString()}
                    </div>
                    <div className="mt-1 text-xs text-[#5e6e82]">
                      {Math.round((selectedData.expenses.foodVenue / selectedData.expenses.total) * 100)}% of total
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle column with stacked widgets */}
            <div className="flex flex-col gap-4">
              {/* Topic of Marketing - Enhanced */}
              <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 backdrop-blur-sm transition-all duration-300 hover:shadow-[#2c7be5]/10 flex-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOFYwYzkuOTQgMCAxOCA4LjA2IDE4IDE4aDIwYzAgOS45NC04LjA2LTE4LTE4IDE4djIwYy05Ljk0IDAtMTgtOC4wNi0xOC0xOEgwYzAtOS45NCA4LjA2LTE4IDE4LTE4VjBjOS45NCAwIDE4IDguMDYgMTggMThoMjB\`\`\`xml;base64,PHN2IDAtMTgtOC4wNi0xOC0xOC0xOEgwYzAtOS45NCA4LjA2LTE4IDE4LTE4VjBjOS45NCAwIDE4IDguMDYgMTggMThoMjB6IiBvcGFjaXR5PSIuMDUiIGZpbGw9IiMyYzdiZTUiLz48cGF0aCBkPSJNMzAgMzBjMC05Ljk0LTguMDYtMTgtMTgtMThWMGM5Ljk0IDAgMTggOC4wNiAxOCAxOGgyMGMwIDkuOTQtOC4wNiAxOC0xOCAxOHYyMGMtOS45NCAwLTE4LTguMDYtMTgtMThIMGMwLTkuOTQgOC4wNi0xOCAxOC0xOFYwYzkuOTQgMCAxOCA4LjA2IDE4IDE4aDIweiIgb3BhY2l0eT0iLjA1IiBmaWxsPSIjMjdiY2ZkIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>

                <h3 className="mb-3 text-center text-xl font-bold text-white relative z-10">Topic Of Marketing</h3>

                {/* Single Topic View */}
                <div className="relative flex-1 flex flex-col justify-center z-10" id="single-topic-view">
                  <div className="bg-gradient-to-r from-[#215cac]/30 to-[#2c7be5]/30 p-5 rounded-lg border border-[#2c7be5]/30 shadow-[0_0_15px_rgba(44,123,229,0.2)]">
                    <div className="flex items-center justify-center mb-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#2c7be5] to-[#27bcfd] flex items-center justify-center mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white"
                        >
                          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                          <path d="M3 3v5h5"></path>
                          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                          <path d="M16 16h5v5"></path>
                        </svg>
                      </div>
                      <div className="text-xs text-[#d8e2ef] font-medium">Current Event</div>
                    </div>

                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef] text-center mb-2">
                      {selectedData.topic}
                    </h2>
                  </div>
                </div>
              </div>

              {/* % of Attendees Becoming Clients - Enhanced */}
              <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 backdrop-blur-sm transition-all duration-300 hover:shadow-[#2c7be5]/10 flex-1">
                <h3 className="mb-3 text-center text-xl font-bold text-white relative z-10">
                  % of Attendees Becoming Clients
                </h3>
                <div className="flex flex-col items-center justify-center">
                  <div className="relative h-32 w-32 mb-3">
                    <svg viewBox="0 0 36 36" className="h-full w-full">
                      <defs>
                        <linearGradient id="gaugeGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#2c7be5" />
                          <stop offset="100%" stopColor="#4d8eea" />
                        </linearGradient>
                        <filter id="glow2" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="2" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>
                      <circle cx="18" cy="18" r="16" fill="#050117" />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#215cac30"
                        strokeWidth="2"
                        strokeDasharray="100, 100"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="url(#gaugeGradient2)"
                        strokeWidth="3"
                        strokeDasharray={`${selectedData.conversionRate}, 100`}
                        strokeLinecap="round"
                        transform="rotate(180 18 18)"
                        filter="url(#glow2)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-3xl font-bold text-white">{selectedData.conversionRate}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 w-full">
                    <div className="bg-[#050117]/50 p-3 rounded-md text-center">
                      <div className="text-xs text-[#5e6e82] mb-1">Attendees</div>
                      <div className="text-xl font-bold text-white">{selectedData.attendees}</div>
                    </div>
                    <div className="bg-[#050117]/50 p-3 rounded-md text-center">
                      <div className="text-xs text-[#5e6e82] mb-1">Clients</div>
                      <div className="text-xl font-bold text-white">{selectedData.clients}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Attendance Breakdown - Third column */}
            <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-5 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 backdrop-blur-sm transition-all duration-300 hover:shadow-[#2c7be5]/10 h-full flex flex-col">
              <h3 className="mb-3 text-center text-2xl font-bold text-white">Event Attendance Breakdown</h3>
              <div className="grid grid-cols-1 gap-3 flex-1">
                <div className="bg-[#050117]/50 p-3 rounded-md flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-white">Registrant Responses</div>
                    <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
                      {selectedData.registrantResponses}
                    </div>
                  </div>
                  <div className="relative h-20 w-20">
                    <svg viewBox="0 0 36 36" className="h-full w-full">
                      <defs>
                        <linearGradient id="circleGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#2c7be5" />
                          <stop offset="100%" stopColor="#4d8eea" />
                        </linearGradient>
                      </defs>
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#050117" strokeWidth="2.5" />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9"
                        fill="none"
                        stroke="url(#circleGradient1)"
                        strokeWidth="3.5"
                        strokeDasharray="100"
                        strokeDashoffset={100 - selectedData.confirmationRate}
                        transform="rotate(-90 18 18)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-white">{selectedData.confirmationRate}%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-[#050117]/50 p-3 rounded-md flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-white">Confirmations (B/U)</div>
                    <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
                      {selectedData.confirmations}
                    </div>
                  </div>
                  <div className="relative h-20 w-20">
                    <svg viewBox="0 0 36 36" className="h-full w-full">
                      <defs>
                        <linearGradient id="circleGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#00d27a" />
                          <stop offset="100%" stopColor="#4aeaa0" />
                        </linearGradient>
                      </defs>
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#050117" strokeWidth="2.5" />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9"
                        fill="none"
                        stroke="url(#circleGradient2)"
                        strokeWidth="3.5"
                        strokeDasharray="100"
                        strokeDashoffset={100 - (selectedData.attendees / selectedData.confirmations) * 100}
                        transform="rotate(-90 18 18)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-white">
                        {Math.round((selectedData.attendees / selectedData.confirmations) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-[#050117]/50 p-3 rounded-md flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-white">Attendees (B/U)</div>
                    <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
                      {selectedData.attendees}
                    </div>
                  </div>
                  <div className="relative h-20 w-20">
                    <svg viewBox="0 0 36 36" className="h-full w-full">
                      <defs>
                        <linearGradient id="circleGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#27bcfd" />
                          <stop offset="100%" stopColor="#4dcbff" />
                        </linearGradient>
                      </defs>
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#050117" strokeWidth="2.5" />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9"
                        fill="none"
                        stroke="url(#circleGradient3)"
                        strokeWidth="3.5"
                        strokeDasharray="100"
                        strokeDashoffset={100 - selectedData.attendanceRate}
                        transform="rotate(-90 18 18)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-white">{selectedData.attendanceRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rest of the dashboard components with selectedData... */}
          {/* I'm continuing with just a few key sections for brevity */}

          {/* Income Breakdown with hover functionality */}
          <div className="mb-6 rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 backdrop-blur-sm">
            <h3 className="mb-3 text-2xl font-bold text-white text-center">Accumulated Income</h3>
            <div className="mb-4 text-center text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
              ${selectedData.accumulatedIncome.total.toLocaleString()}
            </div>

            {(() => {
              const income = selectedData.accumulatedIncome
              const fixedAnnuityPercent = (income.fixedAnnuity / income.total) * 100
              const aumPercent = (income.aum / income.total) * 100
              const planningPercent = (income.planning / income.total) * 100

              return (
                <>
                  <div className="relative mb-4 h-8 overflow-hidden rounded-full bg-[#050117]/50 group">
                    <div className="flex h-full w-full">
                      <div
                        className="h-full bg-gradient-to-r from-[#2c7be5] to-[#4d8eea] group-hover:opacity-80 relative"
                        style={{ width: `${fixedAnnuityPercent}%` }}
                      >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center text-sm font-bold text-white">
                          ${income.fixedAnnuity.toLocaleString()}
                        </div>
                      </div>
                      <div
                        className="h-full bg-gradient-to-r from-[#d8e2ef] to-white group-hover:opacity-80 relative"
                        style={{ width: `${aumPercent}%` }}
                      >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center text-sm font-bold text-[#050117]">
                          ${income.aum.toLocaleString()}
                        </div>
                      </div>
                      <div
                        className="h-full bg-gradient-to-r from-[#27bcfd] to-[#4dcbff] group-hover:opacity-80 relative"
                        style={{ width: `${planningPercent}%` }}
                      >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center text-sm font-bold text-white">
                          ${income.planning.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-[#050117]/50 p-3 rounded-md">
                      <div className="text-sm font-medium text-[#5e6e82] mb-1">Fixed Annuity</div>
                      <div className="text-lg font-bold text-[#2c7be5]">${income.fixedAnnuity.toLocaleString()}</div>
                      <div className="text-xs text-white mt-1">{fixedAnnuityPercent.toFixed(1)}% of total</div>
                    </div>
                    <div className="bg-[#050117]/50 p-3 rounded-md">
                      <div className="text-sm font-medium text-[#5e6e82] mb-1">AUM</div>
                      <div className="text-lg font-bold text-[#d8e2ef]">${income.aum.toLocaleString()}</div>
                      <div className="text-xs text-white mt-1">{aumPercent.toFixed(1)}% of total</div>
                    </div>
                    <div className="bg-[#050117]/50 p-3 rounded-md">
                      <div className="text-sm font-medium text-[#5e6e82] mb-1">Financial Planning</div>
                      <div className="text-lg font-bold text-[#27bcfd]">${income.planning.toLocaleString()}</div>
                      <div className="text-xs text-white mt-1">{planningPercent.toFixed(1)}% of total</div>
                    </div>
                  </div>
                </>
              )
            })()}
          </div>
          {/* Bottom section - restructured layout */}
          <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Client Acquisition Cost - Expanded */}
            <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 backdrop-blur-sm">
              <h3 className="mb-4 text-center text-2xl font-bold text-white">Client Acquisition Cost</h3>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex justify-center items-center mb-3 md:w-3/5">
                  <div className="relative h-72 w-72">
                    <svg viewBox="0 0 100 100" className="h-full w-full">
                      <defs>
                        {acquisitionData.map((item, index) => (
                          <linearGradient
                            key={`gradient-${index}`}
                            id={`acqGradient${index}`}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor={item.color} />
                            <stop offset="100%" stopColor={`${item.color}80`} />
                          </linearGradient>
                        ))}
                      </defs>

                      {/* Traditional pie chart */}
                      <circle cx="50" cy="50" r="45" fill="#050117" />

                      {/* Pie segments with hover effects and labels */}
                      <path
                        d="M50 5 A45 45 0 0 1 95 50 L50 50 Z"
                        fill="url(#acqGradient0)"
                        className="hover:opacity-80 transition-opacity"
                      >
                        <title>${acquisitionData[0].value.toFixed(2)}</title>
                      </path>
                      <text x="72" y="30" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">
                        ${acquisitionData[0].value.toFixed(2)}
                      </text>

                      <path
                        d="M95 50 A45 45 0 0 1 50 95 L50 50 Z"
                        fill="url(#acqGradient1)"
                        className="hover:opacity-80 transition-opacity"
                      >
                        <title>${acquisitionData[1].value.toFixed(2)}</title>
                      </path>
                      <text x="72" y="72" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">
                        ${acquisitionData[1].value.toFixed(2)}
                      </text>

                      <path
                        d="M50 95 A45 45 0 1 1 50 5 L50 50 Z"
                        fill="url(#acqGradient2)"
                        className="hover:opacity-80 transition-opacity"
                      >
                        <title>${acquisitionData[2].value.toFixed(2)}</title>
                      </path>
                      <text x="28" y="50" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">
                        ${acquisitionData[2].value.toFixed(2)}
                      </text>
                    </svg>
                  </div>
                </div>
                <div className="space-y-3 md:w-2/5 flex flex-col justify-center">
                  {acquisitionData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-[#050117]/30 p-4 rounded-md">
                      <div className="flex items-center">
                        <div className="h-5 w-5 rounded-full mr-3" style={{ backgroundColor: item.color }}></div>
                        <span className="text-lg font-medium text-white">{item.name}</span>
                      </div>
                      <span className="text-lg text-white">
                        ${item.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between bg-[#050117]/50 p-4 rounded-md mt-4">
                    <span className="text-xl font-bold text-white">Total Cost</span>
                    <span className="text-xl text-white">${selectedData.expenses.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Conversion Efficiency - Expanded */}
            <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 backdrop-blur-sm">
              <h3 className="mb-4 text-center text-2xl font-bold text-white">Conversion Efficiency</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="bg-[#050117]/50 p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-white">Registration to Attendance</span>
                      <span className="text-lg font-bold text-white">{selectedData.attendanceRate.toFixed(1)}%</span>
                    </div>
                    <div className="mt-3 h-3 w-full rounded-full bg-[#050117]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#00d27a] to-[#4aeaa0]"
                        style={{ width: `${selectedData.attendanceRate}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-[#050117]/50 p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-white">Attendance to Appointment</span>
                      <span className="text-lg font-bold text-white">14.3%</span>
                    </div>
                    <div className="mt-3 h-3 w-full rounded-full bg-[#050117]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#2c7be5] to-[#27bcfd]"
                        style={{ width: "14.3%" }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-[#050117]/50 p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-white">Appointment to Client</span>
                      <span className="text-lg font-bold text-white">50.0%</span>
                    </div>
                    <div className="mt-3 h-3 w-full rounded-full bg-[#050117]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#e63757] to-[#ff6b84]"
                        style={{ width: "50%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-[#050117]/50 p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-white">Overall Conversion</span>
                      <span className="text-lg font-bold text-white">{selectedData.conversionRate}%</span>
                    </div>
                    <div className="mt-3 h-3 w-full rounded-full bg-[#050117]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#748194] to-[#9aa8b9]"
                        style={{ width: `${selectedData.conversionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 flex justify-center">
                  <div className="relative h-40 w-40">
                    <svg viewBox="0 0 36 36" className="h-full w-full">
                      <defs>
                        <linearGradient id="conversionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#2c7be5" />
                          <stop offset="100%" stopColor="#4d8eea" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#050117"
                        strokeWidth="3"
                        strokeDasharray="100, 100"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="url(#conversionGradient)"
                        strokeWidth="4"
                        strokeDasharray={`${selectedData.conversionRate}, 100`}
                        transform="rotate(180 18 18)"
                      />
                      <text x="18" y="16" textAnchor="middle" fontSize="4" fill="white" fontWeight="bold">
                        Overall
                      </text>
                      <text x="18" y="22" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">
                        {selectedData.conversionRate}%
                      </text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            {/* Appointment Trends - As bar chart */}
            <div className="lg:col-span-2 rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 backdrop-blur-sm">
              <h3 className="mb-3 text-2xl font-bold text-white text-center">
                From Event to Engagement: Appointment Trends
              </h3>
              <div className="h-[220px] flex items-end justify-between gap-4 mt-4 px-2">
                {appointmentData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center w-1/5">
                    <div
                      className="w-full rounded-t-md"
                      style={{
                        height: `${(item.value / 4) * 150}px`,
                        background: `linear-gradient(to top, ${item.color}, ${item.color}80)`,
                      }}
                    ></div>
                    <div className="text-xl font-bold text-white mt-2">{item.value}</div>
                    <div className="text-xs font-medium text-white text-center mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Annuities Sold - Separate */}
            <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 backdrop-blur-sm">
              <h3 className="mb-3 text-2xl font-bold text-white text-center">Annuities Sold</h3>
              <div className="flex flex-col items-center justify-center h-[180px]">
                <div className="relative h-28 w-28">
                  <svg viewBox="0 0 36 36" className="h-full w-full">
                    <defs>
                      <linearGradient id="annuityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2c7be5" />
                        <stop offset="100%" stopColor="#4d8eea" />
                      </linearGradient>
                    </defs>
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#050117" strokeWidth="2" />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9"
                      fill="none"
                      stroke="url(#annuityGradient)"
                      strokeWidth="3"
                      strokeDasharray="100"
                      strokeDashoffset="0"
                      transform="rotate(-90 18 18)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">{selectedData.annuitiesSold}</span>
                  </div>
                </div>
                <div className="text-sm font-medium text-[#5e6e82] mt-4">Total Annuities Sold</div>
              </div>
            </div>

            {/* Life Policies Sold - Separate */}
            <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 backdrop-blur-sm">
              <h3 className="mb-3 text-2xl font-bold text-white text-center">Life Policies Sold</h3>
              <div className="flex flex-col items-center justify-center h-[180px]">
                <div className="relative h-28 w-28">
                  <svg viewBox="0 0 36 36" className="h-full w-full">
                    <defs>
                      <linearGradient id="policyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#e63757" />
                        <stop offset="100%" stopColor="#ff6b84" />
                      </linearGradient>
                    </defs>
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#050117" strokeWidth="2" />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9"
                      fill="none"
                      stroke="url(#policyGradient)"
                      strokeWidth="3"
                      strokeDasharray="100"
                      strokeDashoffset={selectedData.lifePoliciesSold > 0 ? "0" : "100"}
                      transform="rotate(-90 18 18)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">{selectedData.lifePoliciesSold}</span>
                  </div>
                </div>
                <div className="text-sm font-medium text-[#5e6e82] mt-4">Total Life Policies Sold</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {/* Financial Production */}
            <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 backdrop-blur-sm flex flex-col h-full">
              <h3 className="mb-4 text-center text-2xl font-bold text-white">Financial Production</h3>
              <div className="grid grid-cols-2 gap-4 flex-1">
                <div className="bg-[#050117]/50 p-4 rounded-md flex flex-col">
                  <div className="text-sm font-medium text-[#5e6e82] mb-1">Fixed Annuity</div>
                  <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef] mb-2">
                    ${selectedData.financialProduction.fixedAnnuity.toLocaleString()}
                  </div>
                  <div className="mt-auto flex items-center">
                    <div className="h-2 w-2 rounded-full bg-[#2c7be5] mr-1"></div>
                    <span className="text-xs text-[#5e6e82]">{selectedData.annuitiesSold} Annuity</span>
                  </div>
                </div>
                <div className="bg-[#050117]/50 p-4 rounded-md flex flex-col">
                  <div className="text-sm font-medium text-[#5e6e82] mb-1">Life Insurance</div>
                  <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef] mb-2">
                    ${selectedData.financialProduction.lifeInsurance.toLocaleString()}
                  </div>
                  <div className="mt-auto flex items-center">
                    <div className="h-2 w-2 rounded-full bg-[#e63757] mr-1"></div>
                    <span className="text-xs text-[#5e6e82]">{selectedData.lifePoliciesSold} Policy</span>
                  </div>
                </div>
                <div className="bg-[#050117]/50 p-4 rounded-md flex flex-col">
                  <div className="text-sm font-medium text-[#5e6e82] mb-1">AUM</div>
                  <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef] mb-2">
                    ${selectedData.financialProduction.aum.toLocaleString()}
                  </div>
                  <div className="mt-auto flex items-center">
                    <div className="h-2 w-2 rounded-full bg-[#27bcfd] mr-1"></div>
                    <span className="text-xs text-[#5e6e82]">{selectedData.clients} Clients</span>
                  </div>
                </div>
                <div className="bg-[#050117]/50 p-4 rounded-md flex flex-col">
                  <div className="text-sm font-medium text-[#5e6e82] mb-1">Financial Planning</div>
                  <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef] mb-2">
                    ${selectedData.financialProduction.planning.toLocaleString()}
                  </div>
                  <div className="mt-auto flex items-center">
                    <div className="h-2 w-2 rounded-full bg-[#00d27a] mr-1"></div>
                    <span className="text-xs text-[#5e6e82]">{selectedData.clients} Fees</span>
                  </div>
                </div>
              </div>

              {/* Add Total section */}
              <div className="mt-4 bg-gradient-to-r from-[#215cac]/30 to-[#2c7be5]/30 p-4 rounded-lg border border-[#215cac]/40">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-white">Total Production</div>
                  <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
                    ${selectedData.financialProduction.total.toLocaleString()}
                  </div>
                </div>
                <div className="mt-2 h-3 w-full rounded-full bg-[#050117]">
                  <div className="h-full w-full rounded-full bg-gradient-to-r from-[#2c7be5] to-[#27bcfd]"></div>
                </div>
                <div className="flex flex-wrap justify-between mt-2">
                  {(() => {
                    const fp = selectedData.financialProduction
                    const fixedAnnuityPercent = ((fp.fixedAnnuity / fp.total) * 100).toFixed(1)
                    const lifePercent = ((fp.lifeInsurance / fp.total) * 100).toFixed(1)
                    const aumPercent = ((fp.aum / fp.total) * 100).toFixed(1)
                    const planningPercent = ((fp.planning / fp.total) * 100).toFixed(1)

                    return (
                      <>
                        <div className="flex items-center mt-1">
                          <div className="h-2 w-2 rounded-full bg-[#2c7be5] mr-1"></div>
                          <span className="text-xs text-[#d8e2ef]">Fixed Annuity: {fixedAnnuityPercent}%</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <div className="h-2 w-2 rounded-full bg-[#e63757] mr-1"></div>
                          <span className="text-xs text-[#d8e2ef]">Life: {lifePercent}%</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <div className="h-2 w-2 rounded-full bg-[#27bcfd] mr-1"></div>
                          <span className="text-xs text-[#d8e2ef]">AUM: {aumPercent}%</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <div className="h-2 w-2 rounded-full bg-[#00d27a] mr-1"></div>
                          <span className="text-xs text-[#d8e2ef]">Planning: {planningPercent}%</span>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>
            </div>

            {/* Registrant Response Analysis */}
            <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 backdrop-blur-sm flex flex-col h-full">
              <h3 className="mb-4 text-center text-2xl font-bold text-white">Registrant Response Analysis</h3>
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="bg-[#050117]/50 p-4 rounded-md">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-medium text-white">Response Rate</span>
                    <span className="text-xl font-bold text-white">{selectedData.responseRate.toFixed(2)}%</span>
                  </div>
                  <div className="h-4 w-full rounded-full bg-[#050117]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#2c7be5] to-[#27bcfd]"
                      style={{ width: `${(selectedData.registrantResponses / selectedData.audienceTotal) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-3 text-sm text-[#5e6e82]">
                    <span>{selectedData.registrantResponses} responses</span>
                    <span>{selectedData.audienceTotal} mailers</span>
                  </div>
                </div>

                <div className="bg-[#050117]/50 p-4 rounded-md">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-medium text-white">Confirmation Rate</span>
                    <span className="text-xl font-bold text-white">{selectedData.confirmationRate.toFixed(1)}%</span>
                  </div>
                  <div className="h-4 w-full rounded-full bg-[#050117]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#00d27a] to-[#4aeaa0]"
                      style={{ width: `${selectedData.confirmationRate}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-3 text-sm text-[#5e6e82]">
                    <span>{selectedData.confirmations} confirmations</span>
                    <span>{selectedData.registrantResponses} responses</span>
                  </div>
                </div>

                <div className="bg-[#050117]/50 p-4 rounded-md">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-medium text-white">Attendance Rate</span>
                    <span className="text-xl font-bold text-white">{selectedData.attendanceRate.toFixed(1)}%</span>
                  </div>
                  <div className="h-4 w-full rounded-full bg-[#050117]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#27bcfd] to-[#4dcbff]"
                      style={{ width: `${selectedData.attendanceRate}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-3 text-sm text-[#5e6e82]">
                    <span>{selectedData.attendees} attendees</span>
                    <span>{selectedData.confirmations} confirmations</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Marketing ROI */}
            <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 backdrop-blur-sm flex flex-col h-full">
              <h3 className="mb-4 text-center text-2xl font-bold text-white">Marketing ROI</h3>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex-1 flex justify-center items-center">
                  <div className="relative w-[200px] h-[200px] mx-auto">
                    <svg viewBox="0 0 36 36" className="h-full w-full">
                      <defs>
                        <linearGradient id="roiGaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#2c7be5" />
                          <stop offset="100%" stopColor="#4d8eea" />
                        </linearGradient>
                        <filter id="roiGlow" x="-10%" y="-10%" width="120%" height="120%">
                          <feGaussianBlur stdDeviation="1" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>
                      <circle cx="18" cy="18" r="16" fill="#050117" />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#215cac30"
                        strokeWidth="2"
                        strokeDasharray="100, 100"
                        strokeLinecap="round"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="url(#roiGaugeGradient)"
                        strokeWidth="3"
                        strokeDasharray={`${Math.min(selectedData.roi / 3, 100)}, 100`}
                        strokeLinecap="round"
                        transform="rotate(-90 18 18)"
                        filter="url(#roiGlow)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-4xl font-bold text-white">{selectedData.roi}%</span>
                        <div className="text-xs text-[#d8e2ef] mt-1">Return on Investment</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full mt-3">
                  <div className="bg-[#050117]/50 p-4 rounded-md text-center">
                    <div className="text-base text-[#5e6e82] mb-2">Total Income</div>
                    <div className="text-4xl font-bold text-white">${selectedData.income.toLocaleString()}</div>
                  </div>
                  <div className="bg-[#050117]/50 p-4 rounded-md text-center">
                    <div className="text-base text-[#5e6e82] mb-2">Total Cost</div>
                    <div className="text-4xl font-bold text-white">${selectedData.expenses.total.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  )
}

// Wrap the Dashboard component with the DateSelectionProvider
export function DashboardWithProvider() {
  return (
    <DateSelectionProvider>
      <Dashboard />
    </DateSelectionProvider>
  )
}

// Export the wrapped component as default
export default DashboardWithProvider
