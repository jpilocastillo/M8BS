"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileSpreadsheet, Calendar, MapPin, Clock, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import SideNav from "@/components/side-nav"
import { createMarketingEvent } from "@/lib/api-client"
import { useAuth } from "@/contexts/auth-context"

export default function DataEntryForm() {
  const router = useRouter()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    date: "",
    location: "",
    topic: "",
    dayOfWeek: "",
    eventTime: "",
    advertisingCost: "",
    foodVenueCost: "",
    typeOfMarketing: "",
    topicOfMarketing: "",
    audienceDemographicsAge: "",
    incomeProducingAssets: "",
    audienceTotal: "",
    registrantResponses: "",
    confirmations: "",
    attendees: "",
    notBooked: "",
    nonAttendees: "",
    firstAppointmentsFromEvent: "",
    setAtEvent: "",
    setAfterEvent: "",
    totalAppointments: "",
    firstAppointmentsAttended: "",
    firstApptNoShows: "",
    secondAppointmentAttended: "",
    clientsFromEvent: "",
    fixedAnnuityProduction: "",
    numAnnuitiesSold: "",
    lifeProduction: "",
    numLifePoliciesSold: "",
    numFinancialPlanningFees: "",
    aumTotal: "",
    numAumClients: "",
    status: "incomplete",
    // Additional marketing metrics
    marketingChannel: "",
    secondaryMarketingSource: "",
    geographicRegion: "",
    demographicTarget: "",
    seasonality: "",
    eventCapacity: "",
    // Additional financial metrics
    annuityPremium: "",
    lifeInsurancePremium: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // Process form data - convert string values to numbers where appropriate
      const processedData = {
        ...formData,
        advertisingCost: formData.advertisingCost ? Number.parseFloat(formData.advertisingCost) : 0,
        foodVenueCost: formData.foodVenueCost ? Number.parseFloat(formData.foodVenueCost) : 0,
        audienceTotal: formData.audienceTotal ? Number.parseInt(formData.audienceTotal) : 0,
        registrantResponses: formData.registrantResponses ? Number.parseInt(formData.registrantResponses) : 0,
        confirmations: formData.confirmations ? Number.parseInt(formData.confirmations) : 0,
        attendees: formData.attendees ? Number.parseInt(formData.attendees) : 0,
        notBooked: formData.notBooked ? Number.parseInt(formData.notBooked) : 0,
        nonAttendees: formData.nonAttendees ? Number.parseInt(formData.nonAttendees) : 0,
        firstAppointmentsFromEvent: formData.firstAppointmentsFromEvent
          ? Number.parseInt(formData.firstAppointmentsFromEvent)
          : 0,
        setAtEvent: formData.setAtEvent ? Number.parseInt(formData.setAtEvent) : 0,
        setAfterEvent: formData.setAfterEvent ? Number.parseInt(formData.setAfterEvent) : 0,
        totalAppointments: formData.totalAppointments ? Number.parseInt(formData.totalAppointments) : 0,
        firstAppointmentsAttended: formData.firstAppointmentsAttended
          ? Number.parseInt(formData.firstAppointmentsAttended)
          : 0,
        firstApptNoShows: formData.firstApptNoShows ? Number.parseInt(formData.firstApptNoShows) : 0,
        secondAppointmentAttended: formData.secondAppointmentAttended
          ? Number.parseInt(formData.secondAppointmentAttended)
          : 0,
        clientsFromEvent: formData.clientsFromEvent ? Number.parseInt(formData.clientsFromEvent) : 0,
        fixedAnnuityProduction: formData.fixedAnnuityProduction
          ? Number.parseFloat(formData.fixedAnnuityProduction)
          : 0,
        numAnnuitiesSold: formData.numAnnuitiesSold ? Number.parseInt(formData.numAnnuitiesSold) : 0,
        lifeProduction: formData.lifeProduction ? Number.parseFloat(formData.lifeProduction) : 0,
        numLifePoliciesSold: formData.numLifePoliciesSold ? Number.parseInt(formData.numLifePoliciesSold) : 0,
        numFinancialPlanningFees: formData.numFinancialPlanningFees
          ? Number.parseInt(formData.numFinancialPlanningFees)
          : 0,
        aumTotal: formData.aumTotal ? Number.parseFloat(formData.aumTotal) : 0,
        numAumClients: formData.numAumClients ? Number.parseInt(formData.numAumClients) : 0,
        eventCapacity: formData.eventCapacity ? Number.parseInt(formData.eventCapacity) : 0,
        annuityPremium: formData.annuityPremium ? Number.parseFloat(formData.annuityPremium) : 0,
        lifeInsurancePremium: formData.lifeInsurancePremium ? Number.parseFloat(formData.lifeInsurancePremium) : 0,
      }

      // Calculate ROI
      const totalExpenses = processedData.advertisingCost + processedData.foodVenueCost
      const totalIncome = processedData.fixedAnnuityProduction + processedData.lifeProduction + processedData.aumTotal

      if (totalExpenses > 0) {
        processedData.roi = Math.round(((totalIncome - totalExpenses) / totalExpenses) * 100)
      } else {
        processedData.roi = 0
      }

      // Submit to API
      const result = await createMarketingEvent(processedData)

      // Redirect to data management page
      router.push("/data-management")
    } catch (err) {
      console.error("Error submitting form:", err)
      setError("Failed to submit data. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#050117] to-[#0a0a29] text-white">
      <SideNav />
      <main className="flex-1 p-6">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-[#5e6e82] hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">
            Manual Data Entry
            <br />
            <span className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
              M8BS Marketing Dashboard
            </span>
          </h1>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 backdrop-blur-sm">
          <div className="border-b border-[#215cac]/20 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-[#2c7be5]" />
              <span>Manual Data Entry</span>
            </h2>
            <p className="text-sm text-[#5e6e82] mt-1">
              Enter your marketing event data manually using the form below.
            </p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Event Details Section */}
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 pb-2 border-b border-[#215cac]/20 text-white">
                  <Calendar className="h-5 w-5 text-[#2c7be5]" />
                  <span>Event Details</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Event #</label>
                    <input
                      type="text"
                      name="event"
                      value={formData.event}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="52"
                    />
                  </div>

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
                      onChange={(e) => setFormData((prev) => ({ ...prev, dayOfWeek: e.target.value }))}
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

              {/* Rest of the form sections remain the same */}
              {/* ... */}
              {/* Marketing Information Section */}
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 pb-2 border-b border-[#215cac]/20 text-white">
                  {/* ... */}
                </h3>
                {/* ... */}
              </div>

              {/* Audience Metrics Section */}
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 pb-2 border-b border-[#215cac]/20 text-white">
                  {/* ... */}
                </h3>
                {/* ... */}
              </div>

              {/* Appointment Tracking Section */}
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 pb-2 border-b border-[#215cac]/20 text-white">
                  {/* ... */}
                </h3>
                {/* ... */}
              </div>

              {/* Client Conversion Section */}
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 pb-2 border-b border-[#215cac]/20 text-white">
                  {/* ... */}
                </h3>
                {/* ... */}
              </div>

              {/* Financial Production Section */}
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 pb-2 border-b border-[#215cac]/20 text-white">
                  {/* ... */}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Fixed Annuity Production</label>
                    <input
                      type="number"
                      name="fixedAnnuityProduction"
                      value={formData.fixedAnnuityProduction}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="Enter amount"
                    />
                  </div>

                  {/* Annuity Premium */}
                  <div className="mb-4">
                    <label htmlFor="annuityPremium" className="block text-sm font-medium text-white mb-1">
                      Annuity Premium
                    </label>
                    <input
                      type="number"
                      id="annuityPremium"
                      name="annuityPremium"
                      value={formData.annuityPremium}
                      onChange={handleInputChange}
                      className="w-full p-2 bg-[#050117] border border-[#215cac]/40 rounded-md text-white"
                      placeholder="Enter annuity premium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white"># Annuities Sold</label>
                    <input
                      type="number"
                      name="numAnnuitiesSold"
                      value={formData.numAnnuitiesSold}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="Enter number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Life Production</label>
                    <input
                      type="number"
                      name="lifeProduction"
                      value={formData.lifeProduction}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="Enter amount"
                    />
                  </div>

                  {/* Life Insurance Premium */}
                  <div className="mb-4">
                    <label htmlFor="lifeInsurancePremium" className="block text-sm font-medium text-white mb-1">
                      Life Insurance Premium
                    </label>
                    <input
                      type="number"
                      id="lifeInsurancePremium"
                      name="lifeInsurancePremium"
                      value={formData.lifeInsurancePremium}
                      onChange={handleInputChange}
                      className="w-full p-2 bg-[#050117] border border-[#215cac]/40 rounded-md text-white"
                      placeholder="Enter life insurance premium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white"># Life Policies Sold</label>
                    <input
                      type="number"
                      name="numLifePoliciesSold"
                      value={formData.numLifePoliciesSold}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="Enter number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white"># Financial Planning Fees</label>
                    <input
                      type="number"
                      name="numFinancialPlanningFees"
                      value={formData.numFinancialPlanningFees}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="Enter number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">AUM Total</label>
                    <input
                      type="number"
                      name="aumTotal"
                      value={formData.aumTotal}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="Enter amount"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white"># AUM Clients</label>
                    <input
                      type="number"
                      name="numAumClients"
                      value={formData.numAumClients}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="Enter number"
                    />
                  </div>
                </div>
              </div>

              {/* Expense Metrics Section */}
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 pb-2 border-b border-[#215cac]/20 text-white">
                  {/* ... */}
                </h3>
                {/* ... */}
              </div>

              {/* Income Metrics Section */}
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 pb-2 border-b border-[#215cac]/20 text-white">
                  {/* ... */}
                </h3>
                {/* ... */}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#2c7be5] to-[#27bcfd] text-white font-bold text-lg flex items-center gap-2 transition-opacity hover:opacity-90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Save className="h-5 w-5" />
                  )}
                  <span>Save Data</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

