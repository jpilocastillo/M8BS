"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Save,
  ArrowLeft,
  Percent,
  Target,
  AlertCircle,
  Info,
} from "lucide-react"
import Link from "next/link"
import SideNav from "@/components/side-nav"

export default function NewEventPage() {
  const router = useRouter()

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/")
    }
  }, [router])

  const [isLoading, setIsLoading] = useState(false)
  const [showMissingDataInfo, setShowMissingDataInfo] = useState(false)
  const [sections, setSections] = useState({
    eventDetails: true,
    marketingInfo: true,
    audienceMetrics: true,
    appointmentTracking: true,
    clientConversion: true,
    financialProduction: true,
  })

  // Form state for manual entry based on the spreadsheet schema
  const [formData, setFormData] = useState({
    // Event details
    eventDate: "",
    eventLocation: "",
    dayOfWeek: "",
    eventTime: "",

    // Marketing information
    advertisingCost: "",
    foodVenueCost: "",
    typeOfMarketing: "",
    topicOfMarketing: "",

    // Audience metrics
    audienceDemographicsAge: "",
    incomeProducingAssets: "",
    audienceTotal: "",
    registrantResponses: "",
    confirmations: "",
    attendees: "",
    notBooked: "",
    nonAttendees: "",

    // Appointment tracking
    firstAppointmentsFromEvent: "",
    setAtEvent: "",
    setAfterEvent: "",
    totalAppointments: "",
    firstAppointmentsAttended: "",
    firstApptNoShows: "",
    secondAppointmentAttended: "",

    // Client conversion
    clientsFromEvent: "",

    // Financial production
    fixedAnnuityProduction: "",
    annuityPremium: "", // New field for annuity premium
    numAnnuitiesSold: "",
    lifeProduction: "",
    lifeInsurancePremium: "", // New field for life insurance premium
    numLifePoliciesSold: "",
    numFinancialPlanningFees: "",
    aumTotal: "",
    numAumClients: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const toggleSection = (section) => {
    setSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Determine if this is a complete or incomplete event
    // An event is considered incomplete if financial data is missing
    const hasFinancialData =
      formData.fixedAnnuityProduction ||
      formData.lifeProduction ||
      formData.aumTotal ||
      formData.numFinancialPlanningFees

    // In a real app, we would save this status along with the form data
    const status = hasFinancialData ? "complete" : "incomplete"

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    // Show success message and redirect
    alert("Marketing event data successfully created!")
    router.push("/data-management")
  }

  // Calculate completion percentage for progress bar
  const calculateCompletion = () => {
    const requiredFields = [
      "eventDate",
      "eventLocation",
      "dayOfWeek",
      "eventTime",
      "advertisingCost",
      "foodVenueCost",
      "typeOfMarketing",
      "audienceTotal",
      "registrantResponses",
      "attendees",
      "firstAppointmentsFromEvent",
      "clientsFromEvent",
    ]

    const financialFields = ["fixedAnnuityProduction", "lifeProduction", "aumTotal"]

    let filledRequired = 0
    let filledFinancial = 0

    requiredFields.forEach((field) => {
      if (formData[field] && formData[field] !== "") filledRequired++
    })

    financialFields.forEach((field) => {
      if (formData[field] && formData[field] !== "") filledFinancial++
    })

    // Required fields are 70% of completion, financial fields are 30%
    const requiredCompletion = (filledRequired / requiredFields.length) * 70
    const financialCompletion = (filledFinancial / financialFields.length) * 30

    return Math.round(requiredCompletion + financialCompletion)
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
            New Marketing Event
            <br />
            <span className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
              Data Entry
            </span>
          </h1>

          <div className="flex items-center gap-2 bg-[#050117]/50 p-2 rounded-lg">
            <div className="text-sm text-[#5e6e82]">Completion:</div>
            <div className="w-48 h-3 bg-[#050117] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#2c7be5] to-[#27bcfd]"
                style={{ width: `${calculateCompletion()}%` }}
              ></div>
            </div>
            <div className="text-sm font-bold">{calculateCompletion()}%</div>
          </div>
        </div>

        {showMissingDataInfo && (
          <div className="mb-6 rounded-lg bg-[#215cac]/10 p-4 border border-[#215cac]/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-[#2c7be5] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Dashboard Data Requirements</h3>
                <p className="text-sm text-[#d8e2ef] mb-2">
                  For optimal dashboard performance, please provide as much data as possible. When insufficient data is
                  available:
                </p>
                <ul className="list-disc pl-5 text-sm text-[#d8e2ef] space-y-1">
                  <li>Widgets will display "Insufficient Data" messages</li>
                  <li>Trend analysis requires at least 3 events with complete data</li>
                  <li>You can always come back later to update incomplete data</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Details Section */}
          <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 overflow-hidden">
            <div
              className="flex items-center justify-between p-4 border-b border-[#215cac]/20 cursor-pointer"
              onClick={() => toggleSection("eventDetails")}
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#2c7be5]" />
                <h3 className="text-xl font-bold text-white">Event Details</h3>
              </div>
              <div className="text-[#5e6e82]">{sections.eventDetails ? "−" : "+"}</div>
            </div>

            {sections.eventDetails && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Event Date</label>
                    <input
                      type="date"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Event Location</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="eventLocation"
                        value={formData.eventLocation}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                        placeholder="Venue name"
                      />
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5e6e82]" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Day of the Week</label>
                    <select
                      name="dayOfWeek"
                      value={formData.dayOfWeek}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                    >
                      <option value="">Select day</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Event Time</label>
                    <div className="relative">
                      <input
                        type="time"
                        name="eventTime"
                        value={formData.eventTime}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      />
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5e6e82]" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Marketing Information Section */}
          <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 overflow-hidden">
            <div
              className="flex items-center justify-between p-4 border-b border-[#215cac]/20 cursor-pointer"
              onClick={() => toggleSection("marketingInfo")}
            >
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[#2c7be5]" />
                <h3 className="text-xl font-bold text-white">Marketing Information</h3>
              </div>
              <div className="text-[#5e6e82]">{sections.marketingInfo ? "−" : "+"}</div>
            </div>

            {sections.marketingInfo && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Advertising Cost ($)</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="advertisingCost"
                        value={formData.advertisingCost}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                        placeholder="0.00"
                        step="0.01"
                      />
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5e6e82]" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Food/Venue Cost ($)</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="foodVenueCost"
                        value={formData.foodVenueCost}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                        placeholder="0.00"
                        step="0.01"
                      />
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5e6e82]" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Type of Marketing</label>
                    <input
                      type="text"
                      name="typeOfMarketing"
                      value={formData.typeOfMarketing}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="MBI Mailer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Topic of Marketing</label>
                    <input
                      type="text"
                      name="topicOfMarketing"
                      value={formData.topicOfMarketing}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="SS & Taxes"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Audience Metrics Section */}
          <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 overflow-hidden">
            <div
              className="flex items-center justify-between p-4 border-b border-[#215cac]/20 cursor-pointer"
              onClick={() => toggleSection("audienceMetrics")}
            >
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#2c7be5]" />
                <h3 className="text-xl font-bold text-white">Audience Metrics</h3>
              </div>
              <div className="text-[#5e6e82]">{sections.audienceMetrics ? "−" : "+"}</div>
            </div>

            {sections.audienceMetrics && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Audience Demographics (Age)</label>
                    <input
                      type="text"
                      name="audienceDemographicsAge"
                      value={formData.audienceDemographicsAge}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="60/67"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Income Producing Assets</label>
                    <input
                      type="text"
                      name="incomeProducingAssets"
                      value={formData.incomeProducingAssets}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="500k-2m"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Audience (Total)</label>
                    <input
                      type="number"
                      name="audienceTotal"
                      value={formData.audienceTotal}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="10000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Registrant Responses</label>
                    <input
                      type="number"
                      name="registrantResponses"
                      value={formData.registrantResponses}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="18"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Confirmations (Buying Units)</label>
                    <input
                      type="number"
                      name="confirmations"
                      value={formData.confirmations}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="18"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Attendees (Buying Units)</label>
                    <input
                      type="number"
                      name="attendees"
                      value={formData.attendees}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="13"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Not Booked</label>
                    <input
                      type="number"
                      name="notBooked"
                      value={formData.notBooked}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Non-Attendees</label>
                    <input
                      type="number"
                      name="nonAttendees"
                      value={formData.nonAttendees}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="5"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Appointment Tracking Section */}
          <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 overflow-hidden">
            <div
              className="flex items-center justify-between p-4 border-b border-[#215cac]/20 cursor-pointer"
              onClick={() => toggleSection("appointmentTracking")}
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#2c7be5]" />
                <h3 className="text-xl font-bold text-white">Appointment Tracking</h3>
              </div>
              <div className="text-[#5e6e82]">{sections.appointmentTracking ? "−" : "+"}</div>
            </div>

            {sections.appointmentTracking && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">1st Appointments from Event</label>
                    <input
                      type="number"
                      name="firstAppointmentsFromEvent"
                      value={formData.firstAppointmentsFromEvent}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Set at Event</label>
                    <input
                      type="number"
                      name="setAtEvent"
                      value={formData.setAtEvent}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Set After Event</label>
                    <input
                      type="number"
                      name="setAfterEvent"
                      value={formData.setAfterEvent}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Total Appointments</label>
                    <input
                      type="number"
                      name="totalAppointments"
                      value={formData.totalAppointments}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">1st Appointments Attended</label>
                    <input
                      type="number"
                      name="firstAppointmentsAttended"
                      value={formData.firstAppointmentsAttended}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="9"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">1st Appointment No Shows</label>
                    <input
                      type="number"
                      name="firstApptNoShows"
                      value={formData.firstApptNoShows}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">2nd Appointment Attended</label>
                    <input
                      type="number"
                      name="secondAppointmentAttended"
                      value={formData.secondAppointmentAttended}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="4"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Client Conversion Section */}
          <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 overflow-hidden">
            <div
              className="flex items-center justify-between p-4 border-b border-[#215cac]/20 cursor-pointer"
              onClick={() => toggleSection("clientConversion")}
            >
              <div className="flex items-center gap-2">
                <Percent className="h-5 w-5 text-[#2c7be5]" />
                <h3 className="text-xl font-bold text-white">Client Conversion</h3>
              </div>
              <div className="text-[#5e6e82]">{sections.clientConversion ? "−" : "+"}</div>
            </div>

            {sections.clientConversion && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">
                      Clients from Event (Written Business)
                    </label>
                    <input
                      type="number"
                      name="clientsFromEvent"
                      value={formData.clientsFromEvent}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="4"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Financial Production Section */}
          <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 overflow-hidden">
            <div
              className="flex items-center justify-between p-4 border-b border-[#215cac]/20 cursor-pointer"
              onClick={() => toggleSection("financialProduction")}
            >
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[#2c7be5]" />
                <h3 className="text-xl font-bold text-white">Financial Production</h3>
              </div>
              <div className="text-[#5e6e82]">{sections.financialProduction ? "−" : "+"}</div>
            </div>

            {sections.financialProduction && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Fixed Annuity Production ($)</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="fixedAnnuityProduction"
                        value={formData.fixedAnnuityProduction}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                        placeholder="80000.00"
                        step="0.01"
                      />
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5e6e82]" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Annuity Premium ($)</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="annuityPremium"
                        value={formData.annuityPremium}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                        placeholder="4000.00"
                        step="0.01"
                      />
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5e6e82]" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white"># of Annuities Sold</label>
                    <input
                      type="number"
                      name="numAnnuitiesSold"
                      value={formData.numAnnuitiesSold}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Life Production ($)</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="lifeProduction"
                        value={formData.lifeProduction}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                        placeholder="11000.00"
                        step="0.01"
                      />
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5e6e82]" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Life Insurance Premium ($)</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="lifeInsurancePremium"
                        value={formData.lifeInsurancePremium}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                        placeholder="1500.00"
                        step="0.01"
                      />
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5e6e82]" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white"># of Life Policies Sold</label>
                    <input
                      type="number"
                      name="numLifePoliciesSold"
                      value={formData.numLifePoliciesSold}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white"># of Financial Planning Fees</label>
                    <input
                      type="number"
                      name="numFinancialPlanningFees"
                      value={formData.numFinancialPlanningFees}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">AUM Total ($)</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="aumTotal"
                        value={formData.aumTotal}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                        placeholder="490839.00"
                        step="0.01"
                      />
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5e6e82]" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white"># of AUM Clients</label>
                    <input
                      type="number"
                      name="numAumClients"
                      value={formData.numAumClients}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="2"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#2c7be5] to-[#27bcfd] text-white font-bold text-lg flex items-center gap-2 transition-opacity hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save className="h-5 w-5" />
              )}
              <span>Save Marketing Event Data</span>
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-6 rounded-lg bg-[#215cac]/10 p-4 border border-[#215cac]/20">
          <div className="flex items-start gap-3">
            <Info className="h-6 w-6 text-[#2c7be5] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Data Entry Tips</h3>
              <p className="text-sm text-[#d8e2ef] mb-2">
                You can save this event with partial data and come back later to complete it:
              </p>
              <ul className="list-disc pl-5 text-sm text-[#d8e2ef] space-y-1">
                <li>Click section headers to expand or collapse sections</li>
                <li>Financial data can be added later as it becomes available</li>
                <li>Events without financial data will be marked as "Incomplete"</li>
                <li>You can find all your events in the Data Management section</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
