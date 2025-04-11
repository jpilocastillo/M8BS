"use client"

import { useState, useEffect } from "react"
import { FileSpreadsheet, RefreshCw } from "lucide-react"
import { useDateSelection } from "@/contexts/date-selection-context"
import CircularProgress from "./charts/circular-progress"
import ProgressBar from "./charts/progress-bar"
import DateFilter from "./date-filter"
import BarChart from "./charts/bar-chart"

// Sample event data for the test user
const testEventData = {
  id: "evt-001",
  date: "2023-12-15",
  location: "Vino Grille",
  topic: "Retirement Outlook",
  dayOfWeek: "Thursday",
  eventTime: "6:00 PM",
  advertisingCost: 5320.52,
  foodVenueCost: 2551.5,
  typeOfMarketing: "MBI Mailer",
  topicOfMarketing: "Retirement Outlook",
  audienceDemographicsAge: "58-71",
  incomeProducingAssets: "500k-2m",
  audienceTotal: 10000,
  registrantResponses: 31,
  confirmations: 28,
  attendees: 28,
  notBooked: 24,
  nonAttendees: 0,
  firstAppointmentsFromEvent: 4,
  setAtEvent: 4,
  setAfterEvent: 0,
  totalAppointments: 4,
  firstAppointmentsAttended: 4,
  firstApptNoShows: 0,
  secondAppointmentAttended: 4,
  clientsFromEvent: 2,
  fixedAnnuityProduction: 80000,
  annuityPremium: 4000, // Added annuity premium
  numAnnuitiesSold: 2,
  lifeProduction: 11000,
  lifeInsurancePremium: 9350, // Added life insurance premium
  numLifePoliciesSold: 0,
  numFinancialPlanningFees: 2,
  financialPlanningFees: 24000,
  aumTotal: 490839,
  numAumClients: 2,
  status: "complete",
  roi: 274,
  conversionRate: 7.1,
  revenue: 258991,
  expenses: 7872.02,
  clients: 2,
  // Additional data from screenshots
  accumulatedIncome: 258991.62,
  fixedAnnuityIncome: 198988.14,
  aumIncome: 36003.48,
  financialPlanningIncome: 24000,
  expensePerBuyingUnit: 281.14,
  expensePerAppointment: 1968.01,
  expensePerClient: 3936.01,
  registrationToAttendanceRate: 100.0,
  attendanceToAppointmentRate: 14.3,
  appointmentToClientRate: 50.0,
  responseRate: 0.31,
  confirmationRate: 90.3,
  attendanceRate: 100.0,
  mileRadius: "10-15 Mi",
  totalProduction: 593839,
}

const mockEvents = [
  testEventData,
  {
    id: "evt-002",
    date: "2024-01-20",
    location: "Another Venue",
    topic: "Estate Planning",
    dayOfWeek: "Saturday",
    eventTime: "2:00 PM",
    advertisingCost: 4000,
    foodVenueCost: 2000,
    typeOfMarketing: "Social Media Ads",
    topicOfMarketing: "Estate Planning",
    audienceDemographicsAge: "45-65",
    incomeProducingAssets: "250k-1m",
    audienceTotal: 5000,
    registrantResponses: 25,
    confirmations: 22,
    attendees: 20,
    notBooked: 18,
    nonAttendees: 2,
    firstAppointmentsFromEvent: 3,
    setAtEvent: 3,
    setAfterEvent: 0,
    totalAppointments: 3,
    firstAppointmentsAttended: 3,
    firstApptNoShows: 0,
    secondAppointmentAttended: 3,
    clientsFromEvent: 1,
    fixedAnnuityProduction: 50000,
    annuityPremium: 2500, // Added annuity premium
    numAnnuitiesSold: 1,
    lifeProduction: 5000,
    lifeInsurancePremium: 4250, // Added life insurance premium
    numLifePoliciesSold: 0,
    numFinancialPlanningFees: 1,
    financialPlanningFees: 12000,
    aumTotal: 250000,
    numAumClients: 1,
    status: "complete",
    roi: 200,
    conversionRate: 5,
    revenue: 100000,
    expenses: 6000,
    clients: 1,
    accumulatedIncome: 100000,
    fixedAnnuityIncome: 70000,
    aumIncome: 18000,
    financialPlanningIncome: 12000,
    expensePerBuyingUnit: 300,
    expensePerAppointment: 2000,
    expensePerClient: 6000,
    registrationToAttendanceRate: 80,
    attendanceToAppointmentRate: 15,
    appointmentToClientRate: 33.3,
    responseRate: 0.5,
    confirmationRate: 88,
    attendanceRate: 90,
    mileRadius: "5-10 Mi",
    totalProduction: 305000,
  },
]

export default function SingleEventDashboard({ event }) {
  const [isExporting, setIsExporting] = useState(false)
  const { selectedDate } = useDateSelection()
  const [currentEvent, setCurrentEvent] = useState(event || testEventData)

  // Update the event when selectedDate changes
  useEffect(() => {
    if (selectedDate && selectedDate !== "all") {
      const selectedEvent = mockEvents.find((e) => e.id === selectedDate)
      if (selectedEvent) {
        setCurrentEvent(selectedEvent)
      }
    } else if (event) {
      setCurrentEvent(event)
    } else {
      setCurrentEvent(testEventData)
    }
  }, [selectedDate, event])

  // If no event data is available
  if (!currentEvent) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-[#2c7be5] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#5e6e82]">Loading event data...</p>
        </div>
      </div>
    )
  }

  // Format currency for display
  const formatCurrency = (value) => {
    if (!value) return "$0"
    return `$${Number(value).toLocaleString()}`
  }

  // Format percentage for display
  const formatPercentage = (value) => {
    if (!value) return "0%"
    return `${value}%`
  }

  // Calculate accumulative income
  const calculateAccumulativeIncome = (event) => {
    // New formula for accumulative income - direct sum of premiums and fees
    const fixedAnnuityIncome = Number(event.annuityPremium || 0) // Direct annuity premium
    const lifeIncome = Number(event.lifeInsurancePremium || 0) // Direct life insurance premium
    const aumIncome = Number(event.aumTotal || 0) * 0.01 // 1% of AUM total
    const financialPlanningIncome = Number(event.financialPlanningFees || 0) // 100% of financial planning fees

    return {
      fixedAnnuityIncome,
      lifeIncome,
      aumIncome,
      financialPlanningIncome,
      total: fixedAnnuityIncome + lifeIncome + aumIncome + financialPlanningIncome,
    }
  }

  // Handle export
  const handleExportCSV = () => {
    setIsExporting(true)
    // Simulate export delay
    setTimeout(() => {
      setIsExporting(false)
      alert("Event data exported successfully!")
    }, 1500)
  }

  // Sample data for mini bar charts
  const miniBarData = [
    { name: "1", value: 30 },
    { name: "2", value: 40 },
    { name: "3", value: 35 },
    { name: "4", value: 50 },
    { name: "5", value: 45 },
    { name: "6", value: 60 },
  ]

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome to Your
            <br />
            <span className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
              M8BS Marketing Dashboard
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <DateFilter />
          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="px-4 py-2 rounded-lg bg-[#215cac]/20 text-white font-bold flex items-center justify-center gap-2 hover:bg-[#215cac]/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FileSpreadsheet className="h-5 w-5" />
            )}
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* ROI */}
        <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5">
          <h3 className="text-lg font-bold text-white mb-2">ROI</h3>
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold text-white">{currentEvent.roi}%</div>
            <div className="flex-shrink-0">
              <BarChart data={miniBarData} dataKey="value" color="#2c7be5" height={50} />
            </div>
          </div>
        </div>

        {/* Written Business */}
        <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5">
          <h3 className="text-lg font-bold text-white mb-2">Written Business</h3>
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold text-white">{currentEvent.clientsFromEvent}</div>
            <div className="flex-shrink-0 bg-[#27bcfd] h-12 w-12 rounded flex items-center justify-center">
              <div className="h-8 w-1 bg-white"></div>
              <div className="h-8 w-1 bg-white mx-1"></div>
              <div className="h-8 w-1 bg-white"></div>
            </div>
          </div>
        </div>

        {/* Accumulative Income */}
        <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5">
          <h3 className="text-lg font-bold text-white mb-2">Accumulative Income</h3>
          <div className="text-4xl font-bold text-white">
            {formatCurrency(calculateAccumulativeIncome(currentEvent).total)}
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-[#2c7be5]"></div>
              <span>Fixed Annuity</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-[#e63757]"></div>
              <span>Life</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-[#00d27a]"></div>
              <span>AUM</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-[#f6c343]"></div>
              <span>Planning</span>
            </div>
          </div>
        </div>

        {/* % of Attendees Becoming Clients */}
        <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5">
          <h3 className="text-lg font-bold text-white mb-2">% of Attendees Becoming Clients</h3>
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold text-white">{currentEvent.conversionRate}%</div>
            <CircularProgress value={currentEvent.conversionRate * 10} color="#2c7be5" size={60} thickness={6} />
          </div>
          <div className="text-xs text-[#5e6e82] mt-1">
            {currentEvent.attendees} Attendees → {currentEvent.clientsFromEvent} Clients
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5">
          <div className="text-sm text-[#5e6e82] mb-1">Day of the Week</div>
          <div className="text-3xl font-bold text-white">{currentEvent.dayOfWeek}</div>
        </div>
        <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5">
          <div className="text-sm text-[#5e6e82] mb-1">Event Location</div>
          <div className="text-3xl font-bold text-white">{currentEvent.location}</div>
        </div>
        <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5">
          <div className="text-sm text-[#5e6e82] mb-1">Event Time</div>
          <div className="text-3xl font-bold text-white">{currentEvent.eventTime}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5">
          <div className="text-sm text-[#5e6e82] mb-1">Age Range</div>
          <div className="text-3xl font-bold text-white">{currentEvent.audienceDemographicsAge}</div>
        </div>
        <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5">
          <div className="text-sm text-[#5e6e82] mb-1">Mile Radius</div>
          <div className="text-3xl font-bold text-white">{currentEvent.mileRadius}</div>
        </div>
        <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5">
          <div className="text-sm text-[#5e6e82] mb-1">Income Producing Assets</div>
          <div className="text-3xl font-bold text-white">{currentEvent.incomeProducingAssets}</div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Marketing Expenses */}
        <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-6 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5">
          <h3 className="text-xl font-bold text-white mb-4">Marketing Expenses</h3>
          <div className="flex justify-center mb-4">
            <CircularProgress
              value={100}
              color="#2c7be5"
              secondaryColor="#00d27a"
              size={180}
              thickness={30}
              centerText={formatCurrency(currentEvent.expenses)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="h-3 w-3 rounded-full bg-[#2c7be5]"></div>
                <span className="text-sm font-medium text-white">Advertising Cost</span>
              </div>
              <div className="text-lg font-bold text-white">{formatCurrency(currentEvent.advertisingCost)}</div>
              <div className="text-xs text-[#5e6e82]">68% of total</div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="h-3 w-3 rounded-full bg-[#00d27a]"></div>
                <span className="text-sm font-medium text-white">Food/Venue Cost</span>
              </div>
              <div className="text-lg font-bold text-white">{formatCurrency(currentEvent.foodVenueCost)}</div>
              <div className="text-xs text-[#5e6e82]">32% of total</div>
            </div>
          </div>
        </div>

        {/* Topic of Marketing */}
        <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-6 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5">
          <h3 className="text-xl font-bold text-white mb-4">Topic Of Marketing</h3>
          <div className="bg-[#0a0a29]/70 p-6 rounded-lg border border-[#215cac]/20 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="h-5 w-5 text-[#2c7be5]" />
              <span className="text-sm text-[#5e6e82]">Current Event</span>
            </div>
            <div className="text-2xl font-bold text-white text-center mt-4">{currentEvent.topicOfMarketing}</div>
          </div>

          <div className="bg-[#0a0a29]/70 p-4 rounded-lg border border-[#215cac]/20">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-[#5e6e82]">% of Attendees Becoming Clients</div>
              <div className="text-sm font-bold text-white">{currentEvent.conversionRate}%</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-sm text-[#5e6e82]">Attendees</div>
                <div className="text-sm font-bold text-white">{currentEvent.attendees}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-[#5e6e82]">Clients</div>
                <div className="text-sm font-bold text-white">{currentEvent.clientsFromEvent}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Event Attendance Breakdown */}
        <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-6 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5">
          <h3 className="text-xl font-bold text-white mb-4">Event Attendance Breakdown</h3>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-1">
                <div className="text-sm text-[#5e6e82]">Registrant Responses</div>
                <div className="text-sm font-bold text-white">{formatPercentage(currentEvent.confirmationRate)}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-white">{currentEvent.registrantResponses}</div>
                <CircularProgress value={currentEvent.confirmationRate} color="#2c7be5" size={60} thickness={6} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <div className="text-sm text-[#5e6e82]">Confirmations (B/U)</div>
                <div className="text-sm font-bold text-white">100%</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-white">{currentEvent.confirmations}</div>
                <CircularProgress value={100} color="#00d27a" size={60} thickness={6} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <div className="text-sm text-[#5e6e82]">Attendees (B/U)</div>
                <div className="text-sm font-bold text-white">100%</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-white">{currentEvent.attendees}</div>
                <CircularProgress value={100} color="#2c7be5" size={60} thickness={6} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accumulated Income */}
      <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-6 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 mb-6">
        <h3 className="text-xl font-bold text-white mb-4 text-center">Accumulated Income</h3>

        {/* Calculate income dynamically instead of using hardcoded values */}
        {(() => {
          const income = calculateAccumulativeIncome(currentEvent)
          const total = income.total

          // Calculate percentages for the progress bar
          const fixedAnnuityPercentage = total > 0 ? (income.fixedAnnuityIncome / total) * 100 : 0
          const lifeIncomePercentage = total > 0 ? (income.lifeIncome / total) * 100 : 0
          const aumIncomePercentage = total > 0 ? (income.aumIncome / total) * 100 : 0
          const financialPlanningPercentage = total > 0 ? (income.financialPlanningIncome / total) * 100 : 0

          return (
            <>
              <div className="text-4xl font-bold text-white text-center mb-4">{formatCurrency(total)}</div>

              <div className="h-6 w-full bg-[#050117]/50 rounded-full overflow-hidden mb-6">
                <div className="h-full flex">
                  <div className="h-full bg-[#2c7be5]" style={{ width: `${fixedAnnuityPercentage}%` }}></div>
                  <div className="h-full bg-[#e63757]" style={{ width: `${lifeIncomePercentage}%` }}></div>
                  <div className="h-full bg-[#00d27a]" style={{ width: `${aumIncomePercentage}%` }}></div>
                  <div className="h-full bg-[#f6c343]" style={{ width: `${financialPlanningPercentage}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-sm text-[#5e6e82] mb-1">Fixed Annuity</div>
                  <div className="text-xl font-bold text-white">{formatCurrency(income.fixedAnnuityIncome)}</div>
                  <div className="text-xs text-[#5e6e82]">{fixedAnnuityPercentage.toFixed(1)}% of total</div>
                </div>
                <div>
                  <div className="text-sm text-[#5e6e82] mb-1">Life</div>
                  <div className="text-xl font-bold text-white">{formatCurrency(income.lifeIncome)}</div>
                  <div className="text-xs text-[#5e6e82]">{lifeIncomePercentage.toFixed(1)}% of total</div>
                </div>
                <div>
                  <div className="text-sm text-[#5e6e82] mb-1">AUM</div>
                  <div className="text-xl font-bold text-white">{formatCurrency(income.aumIncome)}</div>
                  <div className="text-xs text-[#5e6e82]">{aumIncomePercentage.toFixed(1)}% of total</div>
                </div>
                <div>
                  <div className="text-sm text-[#5e6e82] mb-1">Financial Planning</div>
                  <div className="text-xl font-bold text-white">{formatCurrency(income.financialPlanningIncome)}</div>
                  <div className="text-xs text-[#5e6e82]">{financialPlanningPercentage.toFixed(1)}% of total</div>
                </div>
              </div>
            </>
          )
        })()}
      </div>

      {/* Client Acquisition Cost and Conversion Efficiency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Client Acquisition Cost */}
        <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-6 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5">
          <h3 className="text-xl font-bold text-white mb-4">Client Acquisition Cost</h3>

          <div className="flex items-center gap-6 mb-6">
            <CircularProgress
              value={100}
              color="#00d27a"
              secondaryColor="#2c7be5"
              size={180}
              thickness={40}
              centerText={formatCurrency(currentEvent.expensePerClient)}
            />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-[#2c7be5]"></div>
                <div className="flex-1">
                  <div className="text-sm text-[#5e6e82]">Expense per Buying Unit</div>
                  <div className="text-lg font-bold text-white">
                    {formatCurrency(currentEvent.expensePerBuyingUnit)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-[#27bcfd]"></div>
                <div className="flex-1">
                  <div className="text-sm text-[#5e6e82]">Expense per 1st Appointment</div>
                  <div className="text-lg font-bold text-white">
                    {formatCurrency(currentEvent.expensePerAppointment)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-[#00d27a]"></div>
                <div className="flex-1">
                  <div className="text-sm text-[#5e6e82]">Expense per Client</div>
                  <div className="text-lg font-bold text-white">{formatCurrency(currentEvent.expensePerClient)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#050117]/50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="text-sm text-[#5e6e82]">Total Cost</div>
              <div className="text-lg font-bold text-white">{formatCurrency(currentEvent.expenses)}</div>
            </div>
          </div>
        </div>

        {/* Conversion Efficiency */}
        <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-6 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5">
          <h3 className="text-xl font-bold text-white mb-4">Conversion Efficiency</h3>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-1">
                <div className="text-sm text-[#5e6e82]">Registration to Attendance</div>
                <div className="text-sm font-bold text-white">
                  {formatPercentage(currentEvent.registrationToAttendanceRate)}
                </div>
              </div>
              <ProgressBar value={currentEvent.registrationToAttendanceRate} color="#00d27a" />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <div className="text-sm text-[#5e6e82]">Attendance to Appointment</div>
                <div className="text-sm font-bold text-white">
                  {formatPercentage(currentEvent.attendanceToAppointmentRate)}
                </div>
              </div>
              <ProgressBar value={currentEvent.attendanceToAppointmentRate} color="#2c7be5" />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <div className="text-sm text-[#5e6e82]">Appointment to Client</div>
                <div className="text-sm font-bold text-white">
                  {formatPercentage(currentEvent.appointmentToClientRate)}
                </div>
              </div>
              <ProgressBar value={currentEvent.appointmentToClientRate} color="#e63757" />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <div className="text-sm text-[#5e6e82]">Overall Conversion</div>
                <div className="text-sm font-bold text-white">{formatPercentage(currentEvent.conversionRate)}</div>
              </div>
              <div className="flex justify-center mt-4">
                <CircularProgress
                  value={currentEvent.conversionRate * 10}
                  color="#2c7be5"
                  size={120}
                  thickness={10}
                  centerText={`Overall\n${currentEvent.conversionRate}%`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* From Event to Engagement: Appointment Trends */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-6 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5">
          <h3 className="text-xl font-bold text-white mb-4">From Event to Engagement: Appointment Trends</h3>

          <div className="flex justify-between items-end mb-4">
            <div className="flex flex-col items-center">
              <div className="h-28 w-16 bg-[#2c7be5] rounded-t-md flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{currentEvent.setAtEvent}</span>
              </div>
              <div className="text-xs text-[#5e6e82] mt-2 text-center">Set at Event</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-[#e63757] rounded-t-md flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{currentEvent.setAfterEvent}</span>
              </div>
              <div className="text-xs text-[#5e6e82] mt-2 text-center">Set After Event</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-28 w-16 bg-[#27bcfd] rounded-t-md flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{currentEvent.firstAppointmentsAttended}</span>
              </div>
              <div className="text-xs text-[#5e6e82] mt-2 text-center">1st Appt. Attended</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-[#00d27a] rounded-t-md flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{currentEvent.firstApptNoShows}</span>
              </div>
              <div className="text-xs text-[#5e6e82] mt-2 text-center">1st Appt. No Shows</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-28 w-16 bg-[#748194] rounded-t-md flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{currentEvent.secondAppointmentAttended}</span>
              </div>
              <div className="text-xs text-[#5e6e82] mt-2 text-center">2nd Appt. Attended</div>
            </div>
          </div>
        </div>

        {/* Annuities Sold */}
        <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-6 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5">
          <h3 className="text-xl font-bold text-white mb-4">Annuities Sold</h3>

          <div className="flex justify-center">
            <CircularProgress
              value={100}
              color="#2c7be5"
              size={160}
              thickness={15}
              centerText={currentEvent.numAnnuitiesSold.toString()}
            />
          </div>

          <div className="text-center mt-4 text-sm text-[#5e6e82]">Total Annuities Sold</div>
        </div>

        {/* Life Policies Sold */}
        <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-6 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5">
          <h3 className="text-xl font-bold text-white mb-4">Life Policies Sold</h3>

          <div className="flex justify-center">
            <CircularProgress
              value={0}
              color="#000000"
              secondaryColor="#050117"
              size={160}
              thickness={15}
              centerText={currentEvent.numLifePoliciesSold.toString()}
            />
          </div>

          <div className="text-center mt-4 text-sm text-[#5e6e82]">Total Life Policies Sold</div>
        </div>
      </div>

      {/* Financial Production and Registrant Response Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Financial Production */}
        <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-6 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5">
          <h3 className="text-xl font-bold text-white mb-4">Financial Production</h3>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#050117]/50 p-4 rounded-lg">
              <div className="text-sm text-[#5e6e82] mb-1">Fixed Annuity</div>
              <div className="text-3xl font-bold text-white">{formatCurrency(currentEvent.fixedAnnuityProduction)}</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-2 w-2 rounded-full bg-[#2c7be5]"></div>
                <span className="text-xs text-[#5e6e82]">{currentEvent.numAnnuitiesSold} Annuity</span>
              </div>
            </div>

            <div className="bg-[#050117]/50 p-4 rounded-lg">
              <div className="text-sm text-[#5e6e82] mb-1">Life Insurance</div>
              <div className="text-3xl font-bold text-white">{formatCurrency(currentEvent.lifeProduction)}</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-2 w-2 rounded-full bg-[#e63757]"></div>
                <span className="text-xs text-[#5e6e82]">{currentEvent.numLifePoliciesSold} Policy</span>
              </div>
            </div>

            <div className="bg-[#050117]/50 p-4 rounded-lg">
              <div className="text-sm text-[#5e6e82] mb-1">AUM</div>
              <div className="text-3xl font-bold text-white">{formatCurrency(currentEvent.aumTotal)}</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-2 w-2 rounded-full bg-[#2c7be5]"></div>
                <span className="text-xs text-[#5e6e82]">{currentEvent.numAumClients} Clients</span>
              </div>
            </div>

            <div className="bg-[#050117]/50 p-4 rounded-lg">
              <div className="text-sm text-[#5e6e82] mb-1">Financial Planning</div>
              <div className="text-3xl font-bold text-white">{formatCurrency(currentEvent.financialPlanningFees)}</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-2 w-2 rounded-full bg-[#00d27a]"></div>
                <span className="text-xs text-[#5e6e82]">{currentEvent.numFinancialPlanningFees} Fees</span>
              </div>
            </div>
          </div>

          <div className="bg-[#050117]/50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-bold text-white">Total Production</div>
              <div className="text-xl font-bold text-white">{formatCurrency(currentEvent.totalProduction)}</div>
            </div>

            <div className="h-2 w-full bg-[#050117] rounded-full overflow-hidden">
              <div className="h-full bg-[#2c7be5]" style={{ width: "13.5%" }}></div>
            </div>

            <div className="flex justify-between mt-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-[#2c7be5]"></div>
                <span className="text-[#5e6e82]">Fixed Annuity: 13.5%</span>
              </div>

              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-[#e63757]"></div>
                <span className="text-[#5e6e82]">Life: 1.9%</span>
              </div>

              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-[#2c7be5]"></div>
                <span className="text-[#5e6e82]">AUM: 82.7%</span>
              </div>

              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-[#00d27a]"></div>
                <span className="text-[#5e6e82]">Planning: 2.0%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Registrant Response Analysis */}
        <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-6 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5">
          <h3 className="text-xl font-bold text-white mb-4">Registrant Response Analysis</h3>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-1">
                <div className="text-sm text-[#5e6e82]">Response Rate</div>
                <div className="text-sm font-bold text-white">{formatPercentage(currentEvent.responseRate)}</div>
              </div>
              <ProgressBar value={currentEvent.responseRate} color="#2c7be5" />
              <div className="flex justify-between mt-1 text-xs text-[#5e6e82]">
                <span>{currentEvent.registrantResponses} responses</span>
                <span>{currentEvent.audienceTotal} mailers</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <div className="text-sm text-[#5e6e82]">Confirmation Rate</div>
                <div className="text-sm font-bold text-white">{formatPercentage(currentEvent.confirmationRate)}</div>
              </div>
              <ProgressBar value={currentEvent.confirmationRate} color="#00d27a" />
              <div className="flex justify-between mt-1 text-xs text-[#5e6e82]">
                <span>{currentEvent.confirmations} confirmations</span>
                <span>{currentEvent.registrantResponses} responses</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <div className="text-sm text-[#5e6e82]">Attendance Rate</div>
                <div className="text-sm font-bold text-white">{formatPercentage(currentEvent.attendanceRate)}</div>
              </div>
              <ProgressBar value={currentEvent.attendanceRate} color="#2c7be5" />
              <div className="flex justify-between mt-1 text-xs text-[#5e6e82]">
                <span>{currentEvent.attendees} attendees</span>
                <span>{currentEvent.confirmations} confirmations</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marketing ROI */}
      <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-6 border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 mb-6">
        <h3 className="text-xl font-bold text-white mb-4">Marketing ROI</h3>

        <div className="flex items-center gap-8">
          <CircularProgress
            value={Math.min(currentEvent.roi / 3, 100)}
            color="#2c7be5"
            size={200}
            thickness={20}
            centerText={`${currentEvent.roi}%\nReturn on Investment`}
          />

          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-[#5e6e82] mb-1">Total Income</div>
                <div className="text-3xl font-bold text-white">{formatCurrency(currentEvent.revenue)}</div>
              </div>

              <div>
                <div className="text-sm text-[#5e6e82] mb-1">Total Cost</div>
                <div className="text-3xl font-bold text-white">{formatCurrency(currentEvent.expenses)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
