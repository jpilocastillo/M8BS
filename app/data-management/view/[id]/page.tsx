"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  Users,
  DollarSign,
  Edit,
  Target,
  PieChart,
  Download,
  Printer,
  FileSpreadsheet,
} from "lucide-react"
import SideNav from "@/components/side-nav"
import { convertToCSV, downloadCSV, formatEventDataForExport } from "@/utils/export-utils"

// Sample marketing events data - same as in data-management page
const sampleEvents = [
  {
    id: "evt-001",
    date: "2023-12-15",
    location: "Vino Grille",
    topic: "Retirement Outlook",
    dayOfWeek: "Friday",
    eventTime: "18:00",
    advertisingCost: "5320.52",
    foodVenueCost: "2551.50",
    typeOfMarketing: "MBI Mailer",
    topicOfMarketing: "Retirement Outlook",
    audienceDemographicsAge: "58-71",
    incomeProducingAssets: "500k-2m",
    audienceTotal: "10000",
    registrantResponses: "31",
    confirmations: "28",
    attendees: "28",
    notBooked: "24",
    nonAttendees: "0",
    firstAppointmentsFromEvent: "4",
    setAtEvent: "4",
    setAfterEvent: "0",
    totalAppointments: "4",
    firstAppointmentsAttended: "4",
    firstApptNoShows: "0",
    secondAppointmentAttended: "4",
    clientsFromEvent: "2",
    fixedAnnuityProduction: "80000",
    numAnnuitiesSold: "1",
    lifeProduction: "11000",
    numLifePoliciesSold: "0",
    numFinancialPlanningFees: "2",
    aumTotal: "490839",
    numAumClients: "2",
    status: "complete",
    marketingChannel: "Email",
    secondaryMarketingSource: "Social Media",
    geographicRegion: "Northeast",
    demographicTarget: "Affluent Retirees",
    seasonality: "Winter",
    eventCapacity: "50",
    eventCapacityUtilization: "80",
  },
  {
    id: "evt-002",
    date: "2023-11-30",
    location: "Parkside Hotel",
    topic: "Tax Strategies",
    dayOfWeek: "Thursday",
    eventTime: "18:30",
    advertisingCost: "4800.00",
    foodVenueCost: "2200.00",
    typeOfMarketing: "MBI Mailer",
    topicOfMarketing: "Tax Strategies",
    audienceDemographicsAge: "55-70",
    incomeProducingAssets: "400k-1.5m",
    audienceTotal: "8000",
    registrantResponses: "25",
    confirmations: "22",
    attendees: "22",
    notBooked: "19",
    nonAttendees: "0",
    firstAppointmentsFromEvent: "3",
    setAtEvent: "3",
    setAfterEvent: "0",
    totalAppointments: "3",
    firstAppointmentsAttended: "3",
    firstApptNoShows: "0",
    secondAppointmentAttended: "2",
    clientsFromEvent: "1",
    fixedAnnuityProduction: "120500",
    numAnnuitiesSold: "2",
    lifeProduction: "0",
    numLifePoliciesSold: "0",
    numFinancialPlanningFees: "0",
    aumTotal: "0",
    numAumClients: "0",
    status: "complete",
    marketingChannel: "Direct Mail",
    secondaryMarketingSource: "Referral",
    geographicRegion: "Midwest",
    demographicTarget: "Pre-Retirees",
    seasonality: "Fall",
    eventCapacity: "40",
    eventCapacityUtilization: "75",
  },
]

export default function ViewEventPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params

  const [eventData, setEventData] = useState(null)
  const [showExportOptions, setShowExportOptions] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Check if user is logged in and load event data
  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/")
      return
    }

    // Find the event with the matching ID
    const event = sampleEvents.find((event) => event.id === id)
    if (event) {
      setEventData(event)
    } else {
      // If event not found, redirect to data management page
      router.push("/data-management")
    }
  }, [id, router])

  useEffect(() => {
    function handleClickOutside(event) {
      if (showExportOptions && !event.target.closest("button")) {
        setShowExportOptions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showExportOptions])

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return ""
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  // Format currency for display
  const formatCurrency = (value) => {
    if (!value) return "$0.00"
    return `$${Number.parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  // Calculate total expenses
  const calculateTotalExpenses = () => {
    if (!eventData) return 0
    const advertising = Number.parseFloat(eventData.advertisingCost) || 0
    const foodVenue = Number.parseFloat(eventData.foodVenueCost) || 0
    return advertising + foodVenue
  }

  // Calculate response rate
  const calculateResponseRate = () => {
    if (!eventData) return 0
    const responses = Number.parseFloat(eventData.registrantResponses) || 0
    const audience = Number.parseFloat(eventData.audienceTotal) || 1 // Avoid division by zero
    return ((responses / audience) * 100).toFixed(2)
  }

  // Calculate attendance rate
  const calculateAttendanceRate = () => {
    if (!eventData) return 0
    const attendees = Number.parseFloat(eventData.attendees) || 0
    const confirmations = Number.parseFloat(eventData.confirmations) || 1 // Avoid division by zero
    return ((attendees / confirmations) * 100).toFixed(2)
  }

  // Calculate client conversion rate
  const calculateClientConversionRate = () => {
    if (!eventData) return 0
    const clients = Number.parseFloat(eventData.clientsFromEvent) || 0
    const attendees = Number.parseFloat(eventData.attendees) || 1 // Avoid division by zero
    return ((clients / attendees) * 100).toFixed(2)
  }

  // Calculate ROI
  const calculateROI = () => {
    if (!eventData) return 0

    // Calculate total income
    const fixedAnnuity = Number.parseFloat(eventData.fixedAnnuityProduction) || 0
    const life = Number.parseFloat(eventData.lifeProduction) || 0
    const aum = Number.parseFloat(eventData.aumTotal) || 0
    const totalIncome = fixedAnnuity + life + aum

    // Calculate total expenses
    const totalExpenses = calculateTotalExpenses()

    // Avoid division by zero
    if (totalExpenses === 0) return 0

    return (((totalIncome - totalExpenses) / totalExpenses) * 100).toFixed(2)
  }

  const handleExportCSV = () => {
    setIsExporting(true)
    try {
      // Format the data for export
      const formattedData = formatEventDataForExport(eventData)

      // Convert to CSV
      const csvContent = convertToCSV(formattedData)

      // Generate filename with event location and date
      const fileName = `${eventData.location.replace(/\s+/g, "-")}_${eventData.date}_export.csv`

      // Download the CSV file
      downloadCSV(csvContent, fileName)

      // Hide export options
      setShowExportOptions(false)
    } catch (error) {
      console.error("Export failed:", error)
      alert("Export failed. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  if (!eventData) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#050117] to-[#0a0a29] text-white">
        <SideNav />
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="h-10 w-10 border-4 border-[#2c7be5] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#5e6e82]">Loading event data...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#050117] to-[#0a0a29] text-white">
      <SideNav />
      <main className="flex-1 p-6">
        <div className="mb-6">
          <Link
            href="/data-management"
            className="inline-flex items-center gap-2 text-[#5e6e82] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Data Management</span>
          </Link>
        </div>

        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-white">
            Event Details
            <br />
            <span className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
              {eventData.location}
            </span>
          </h1>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/data-management/edit/${id}`}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#2c7be5] to-[#27bcfd] text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Edit className="h-5 w-5" />
              <span>Edit Event</span>
            </Link>
            <div className="relative">
              <button
                onClick={() => setShowExportOptions(!showExportOptions)}
                className="px-4 py-2 rounded-lg bg-[#215cac]/20 text-white font-bold flex items-center justify-center gap-2 hover:bg-[#215cac]/30 transition-colors"
              >
                <Download className="h-5 w-5" />
                <span>Export Data</span>
              </button>

              {showExportOptions && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#0a0a29] border border-[#215cac]/40 z-10">
                  <div className="py-1">
                    <button
                      onClick={handleExportCSV}
                      disabled={isExporting}
                      className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#215cac]/20 flex items-center gap-2"
                    >
                      {isExporting ? (
                        <div className="h-4 w-4 border-2 border-[#2c7be5] border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <FileSpreadsheet className="h-4 w-4 text-[#2c7be5]" />
                      )}
                      <span>Export as CSV</span>
                    </button>
                    <button
                      disabled={true}
                      className="w-full text-left px-4 py-2 text-sm text-[#5e6e82] cursor-not-allowed flex items-center gap-2"
                    >
                      <Printer className="h-4 w-4" />
                      <span>Export as PDF (Coming Soon)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button className="px-4 py-2 rounded-lg bg-[#215cac]/20 text-white font-bold flex items-center justify-center gap-2 hover:bg-[#215cac]/30 transition-colors">
              <Printer className="h-5 w-5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Event Summary */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-[#2c7be5]" />
              <h3 className="text-lg font-bold text-white">Event Date & Time</h3>
            </div>
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
              {formatDate(eventData.date)}
            </div>
            <div className="text-sm text-[#5e6e82] mt-1">
              {eventData.dayOfWeek} at {formatTime(eventData.eventTime)}
            </div>
          </div>

          <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-[#2c7be5]" />
              <h3 className="text-lg font-bold text-white">Marketing Topic</h3>
            </div>
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
              {eventData.topicOfMarketing}
            </div>
            <div className="text-sm text-[#5e6e82] mt-1">{eventData.typeOfMarketing}</div>
          </div>

          <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-[#2c7be5]" />
              <h3 className="text-lg font-bold text-white">Total Expenses</h3>
            </div>
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
              {formatCurrency(calculateTotalExpenses())}
            </div>
            <div className="text-sm text-[#5e6e82] mt-1">
              Advertising: {formatCurrency(eventData.advertisingCost)} | Venue:{" "}
              {formatCurrency(eventData.foodVenueCost)}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mb-6 rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 p-4">
          <h2 className="text-xl font-bold text-white mb-4">Key Performance Metrics</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#050117]/50 p-4 rounded-lg">
              <div className="text-sm text-[#5e6e82] mb-1">Response Rate</div>
              <div className="text-3xl font-bold text-white">{calculateResponseRate()}%</div>
              <div className="text-xs text-[#5e6e82] mt-1">
                {eventData.registrantResponses} responses from {eventData.audienceTotal} audience
              </div>
            </div>

            <div className="bg-[#050117]/50 p-4 rounded-lg">
              <div className="text-sm text-[#5e6e82] mb-1">Attendance Rate</div>
              <div className="text-3xl font-bold text-white">{calculateAttendanceRate()}%</div>
              <div className="text-xs text-[#5e6e82] mt-1">
                {eventData.attendees} attendees from {eventData.confirmations} confirmations
              </div>
            </div>

            <div className="bg-[#050117]/50 p-4 rounded-lg">
              <div className="text-sm text-[#5e6e82] mb-1">Client Conversion</div>
              <div className="text-3xl font-bold text-white">{calculateClientConversionRate()}%</div>
              <div className="text-xs text-[#5e6e82] mt-1">
                {eventData.clientsFromEvent} clients from {eventData.attendees} attendees
              </div>
            </div>

            <div className="bg-[#050117]/50 p-4 rounded-lg">
              <div className="text-sm text-[#5e6e82] mb-1">ROI</div>
              <div className="text-3xl font-bold text-white">{calculateROI()}%</div>
              <div className="text-xs text-[#5e6e82] mt-1">Based on total income and expenses</div>
            </div>
          </div>
        </div>

        {/* Detailed Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Audience Metrics */}
          <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 p-4">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#215cac]/20">
              <Users className="h-5 w-5 text-[#2c7be5]" />
              <h3 className="text-lg font-bold text-white">Audience Metrics</h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[#5e6e82]">Audience Demographics (Age)</span>
                <span className="text-white font-medium">{eventData.audienceDemographicsAge}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#5e6e82]">Income Producing Assets</span>
                <span className="text-white font-medium">{eventData.incomeProducingAssets}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#5e6e82]">Audience Total</span>
                <span className="text-white font-medium">{eventData.audienceTotal}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#5e6e82]">Registrant Responses</span>
                <span className="text-white font-medium">{eventData.registrantResponses}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#5e6e82]">Confirmations</span>
                <span className="text-white font-medium">{eventData.confirmations}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#5e6e82]">Attendees</span>
                <span className="text-white font-medium">{eventData.attendees}</span>
              </div>
            </div>
          </div>

          {/* Appointment Tracking */}
          <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 p-4">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#215cac]/20">
              <Calendar className="h-5 w-5 text-[#2c7be5]" />
              <h3 className="text-lg font-bold text-white">Appointment Tracking</h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[#5e6e82]">1st Appointments from Event</span>
                <span className="text-white font-medium">{eventData.firstAppointmentsFromEvent}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#5e6e82]">Set at Event</span>
                <span className="text-white font-medium">{eventData.setAtEvent}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#5e6e82]">Set After Event</span>
                <span className="text-white font-medium">{eventData.setAfterEvent}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#5e6e82]">Total Appointments</span>
                <span className="text-white font-medium">{eventData.totalAppointments}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#5e6e82]">1st Appointments Attended</span>
                <span className="text-white font-medium">{eventData.firstAppointmentsAttended}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#5e6e82]">2nd Appointment Attended</span>
                <span className="text-white font-medium">{eventData.secondAppointmentAttended}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Marketing Metrics */}
        <div className="mb-6 rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 p-4">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#215cac]/20">
            <Target className="h-5 w-5 text-[#2c7be5]" />
            <h3 className="text-lg font-bold text-white">Additional Marketing Metrics</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eventData.marketingChannel && (
              <div className="bg-[#050117]/50 p-4 rounded-lg">
                <div className="text-sm text-[#5e6e82] mb-1">Marketing Channel</div>
                <div className="text-xl font-bold text-white">{eventData.marketingChannel}</div>
              </div>
            )}

            {eventData.secondaryMarketingSource && (
              <div className="bg-[#050117]/50 p-4 rounded-lg">
                <div className="text-sm text-[#5e6e82] mb-1">Secondary Marketing Source</div>
                <div className="text-xl font-bold text-white">{eventData.secondaryMarketingSource}</div>
              </div>
            )}

            {eventData.geographicRegion && (
              <div className="bg-[#050117]/50 p-4 rounded-lg">
                <div className="text-sm text-[#5e6e82] mb-1">Geographic Region</div>
                <div className="text-xl font-bold text-white">{eventData.geographicRegion}</div>
              </div>
            )}

            {eventData.demographicTarget && (
              <div className="bg-[#050117]/50 p-4 rounded-lg">
                <div className="text-sm text-[#5e6e82] mb-1">Demographic Target</div>
                <div className="text-xl font-bold text-white">{eventData.demographicTarget}</div>
              </div>
            )}

            {eventData.seasonality && (
              <div className="bg-[#050117]/50 p-4 rounded-lg">
                <div className="text-sm text-[#5e6e82] mb-1">Seasonality</div>
                <div className="text-xl font-bold text-white">{eventData.seasonality}</div>
              </div>
            )}

            {eventData.eventCapacity && (
              <div className="bg-[#050117]/50 p-4 rounded-lg">
                <div className="text-sm text-[#5e6e82] mb-1">Event Capacity</div>
                <div className="text-xl font-bold text-white">{eventData.eventCapacity}</div>
                {eventData.eventCapacityUtilization && (
                  <div className="text-xs text-[#5e6e82] mt-1">{eventData.eventCapacityUtilization}% utilization</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Financial Production */}
        <div className="mb-6 rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 p-4">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#215cac]/20">
            <PieChart className="h-5 w-5 text-[#2c7be5]" />
            <h3 className="text-lg font-bold text-white">Financial Production</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-[#050117]/50 p-4 rounded-lg">
              <div className="text-sm text-[#5e6e82] mb-1">Fixed Annuity Production</div>
              <div className="text-2xl font-bold text-white">{formatCurrency(eventData.fixedAnnuityProduction)}</div>
              <div className="text-xs text-[#5e6e82] mt-1">{eventData.numAnnuitiesSold} annuities sold</div>
            </div>

            {/* Annuity Premium */}
            <div className="bg-[#050117]/50 p-4 rounded-lg">
              <div className="text-sm text-[#5e6e82] mb-1">Annuity Premium</div>
              <div className="text-2xl font-bold text-white">{formatCurrency(eventData.annuityPremium || 0)}</div>
            </div>

            <div className="bg-[#050117]/50 p-4 rounded-lg">
              <div className="text-sm text-[#5e6e82] mb-1">Life Production</div>
              <div className="text-2xl font-bold text-white">{formatCurrency(eventData.lifeProduction)}</div>
              <div className="text-xs text-[#5e6e82] mt-1">{eventData.numLifePoliciesSold} policies sold</div>
            </div>

            {/* Life Insurance Premium */}
            <div className="bg-[#050117]/50 p-4 rounded-lg">
              <div className="text-sm text-[#5e6e82] mb-1">Life Insurance Premium</div>
              <div className="text-2xl font-bold text-white">{formatCurrency(eventData.lifeInsurancePremium || 0)}</div>
            </div>

            <div className="bg-[#050117]/50 p-4 rounded-lg">
              <div className="text-sm text-[#5e6e82] mb-1">AUM Total</div>
              <div className="text-2xl font-bold text-white">{formatCurrency(eventData.aumTotal)}</div>
              <div className="text-xs text-[#5e6e82] mt-1">{eventData.numAumClients} AUM clients</div>
            </div>

            <div className="bg-[#050117]/50 p-4 rounded-lg lg:col-span-3">
              <div className="text-sm text-[#5e6e82] mb-1">Total Production</div>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(
                  Number.parseFloat(eventData.fixedAnnuityProduction || 0) +
                    Number.parseFloat(eventData.lifeProduction || 0) +
                    Number.parseFloat(eventData.aumTotal || 0),
                )}
              </div>
              <div className="text-xs text-[#5e6e82] mt-1">{eventData.clientsFromEvent} clients from event</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
