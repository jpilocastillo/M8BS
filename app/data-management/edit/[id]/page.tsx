"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Clock, Users, DollarSign, Save, Target, Info, CheckCircle2 } from "lucide-react"
import SideNav from "@/components/side-nav"
import { fetchMarketingEvent, updateMarketingEvent } from "@/lib/api-client"

export default function EditEventPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params

  const [formData, setFormData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [error, setError] = useState(null)
  const [sections, setSections] = useState({
    eventDetails: true,
    marketingInfo: true,
    audienceMetrics: true,
    appointmentTracking: true,
    clientConversion: true,
    financialProduction: true,
    additionalMetrics: true,
  })

  // Load event data
  useEffect(() => {
    async function loadEventData() {
      try {
        setIsLoading(true)
        const eventData = await fetchMarketingEvent(id)
        setFormData(eventData)
        setError(null)
      } catch (err) {
        console.error("Failed to load event data:", err)
        setError("Failed to load event data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    loadEventData()
  }, [id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const toggleSection = (section) => {
    setSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Update status based on financial production fields
      const updatedData = { ...formData }

      // Check if financial production fields are filled
      const hasFinancialData =
        updatedData.fixedAnnuityProduction ||
        updatedData.lifeProduction ||
        updatedData.aumTotal ||
        updatedData.numFinancialPlanningFees

      // Update status if needed
      if (hasFinancialData && updatedData.status === "incomplete") {
        updatedData.status = "complete"
      }

      // Process data - convert string values to numbers
      const processedData = {
        ...updatedData,
        advertisingCost: updatedData.advertisingCost ? Number.parseFloat(updatedData.advertisingCost) : 0,
        foodVenueCost: updatedData.foodVenueCost ? Number.parseFloat(updatedData.foodVenueCost) : 0,
        // Add other numeric conversions as needed
      }

      // Calculate ROI
      const totalExpenses = processedData.advertisingCost + processedData.foodVenueCost
      const totalIncome =
        (Number.parseFloat(processedData.fixedAnnuityProduction) || 0) +
        (Number.parseFloat(processedData.lifeProduction) || 0) +
        (Number.parseFloat(processedData.aumTotal) || 0)

      if (totalExpenses > 0) {
        processedData.roi = Math.round(((totalIncome - totalExpenses) / totalExpenses) * 100)
      }

      // Update via API
      await updateMarketingEvent(id, processedData)

      // Show success message
      setIsSaved(true)
      setError(null)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setIsSaved(false)
      }, 3000)
    } catch (err) {
      console.error("Error updating event:", err)
      setError("Failed to update event. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate completion percentage for progress bar
  const calculateCompletion = () => {
    if (!formData || Object.keys(formData).length === 0) return 0

    const requiredFields = [
      "date",
      "location",
      "topic",
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
            Edit Marketing Event
            <br />
            <span className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
              {formData.location || "Loading..."}
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

        {/* Success message */}
        {isSaved && (
          <div className="mb-6 rounded-lg bg-[#00d27a]/10 p-4 border border-[#00d27a]/20 flex items-center gap-3 animate-pulse">
            <CheckCircle2 className="h-6 w-6 text-[#00d27a]" />
            <div className="text-[#00d27a] font-medium">Event data successfully saved!</div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg bg-[#ff0000]/10 p-4 border border-[#ff0000]/20 flex items-center gap-3 animate-pulse">
            <Info className="h-6 w-6 text-[#ff0000]" />
            <div className="text-[#ff0000] font-medium">{error}</div>
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
                      name="date"
                      value={formData.date || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Event Location</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="location"
                        value={formData.location || ""}
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
                      value={formData.dayOfWeek || ""}
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
                        value={formData.eventTime || ""}
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
                        value={formData.advertisingCost || ""}
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
                        value={formData.foodVenueCost || ""}
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
                      value={formData.typeOfMarketing || ""}
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
                      value={formData.topicOfMarketing || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="Retirement Outlook"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Additional Marketing Metrics Section */}
          <div className="rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5 overflow-hidden">
            <div
              className="flex items-center justify-between p-4 border-b border-[#215cac]/20 cursor-pointer"
              onClick={() => toggleSection("additionalMetrics")}
            >
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[#2c7be5]" />
                <h3 className="text-xl font-bold text-white">Additional Marketing Metrics</h3>
              </div>
              <div className="text-[#5e6e82]">{sections.additionalMetrics ? "−" : "+"}</div>
            </div>

            {sections.additionalMetrics && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Marketing Channel</label>
                    <select
                      name="marketingChannel"
                      value={formData.marketingChannel || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                    >
                      <option value="">Select channel</option>
                      <option value="Direct Mail">Direct Mail</option>
                      <option value="Email Campaign">Email Campaign</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Radio">Radio</option>
                      <option value="TV">TV</option>
                      <option value="Newspaper">Newspaper</option>
                      <option value="Referral">Referral</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Secondary Marketing Source</label>
                    <input
                      type="text"
                      name="secondaryMarketingSource"
                      value={formData.secondaryMarketingSource || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="Email Campaign"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Geographic Region</label>
                    <input
                      type="text"
                      name="geographicRegion"
                      value={formData.geographicRegion || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="Northwest"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Demographic Target</label>
                    <input
                      type="text"
                      name="demographicTarget"
                      value={formData.demographicTarget || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="Retirees"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Seasonality</label>
                    <select
                      name="seasonality"
                      value={formData.seasonality || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                    >
                      <option value="">Select season</option>
                      <option value="Winter">Winter</option>
                      <option value="Spring">Spring</option>
                      <option value="Summer">Summer</option>
                      <option value="Fall">Fall</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">Event Capacity</label>
                    <input
                      type="number"
                      name="eventCapacity"
                      value={formData.eventCapacity || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="40"
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
                      value={formData.audienceDemographicsAge || ""}
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
                      value={formData.incomeProducingAssets || ""}
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
                      value={formData.audienceTotal || ""}
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
                      value={formData.registrantResponses || ""}
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
                      value={formData.confirmations || ""}
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
                      value={formData.attendees || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                      placeholder="13"
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
                        value={formData.fixedAnnuityProduction || ""}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                        placeholder="80000.00"
                        step="0.01"
                      />
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5e6e82]" />
                    </div>
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
                      defaultValue={formData.annuityPremium}
                      onChange={handleInputChange}
                      className="w-full p-2 bg-[#050117] border border-[#215cac]/40 rounded-md text-white"
                      placeholder="Enter annuity premium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white"># of Annuities Sold</label>
                    <input
                      type="number"
                      name="numAnnuitiesSold"
                      value={formData.numAnnuitiesSold || ""}
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
                        value={formData.lifeProduction || ""}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium"
                        placeholder="11000.00"
                        step="0.01"
                      />
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5e6e82]" />
                    </div>
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
                      defaultValue={formData.lifeInsurancePremium}
                      onChange={handleInputChange}
                      className="w-full p-2 bg-[#050117] border border-[#215cac]/40 rounded-md text-white"
                      placeholder="Enter life insurance premium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-white">AUM Total ($)</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="aumTotal"
                        value={formData.aumTotal || ""}
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
                      value={formData.numAumClients || ""}
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
              <span>Save Changes</span>
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-6 rounded-lg bg-[#215cac]/10 p-4 border border-[#215cac]/20">
          <div className="flex items-start gap-3">
            <Info className="h-6 w-6 text-[#2c7be5] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Updating Event Data</h3>
              <p className="text-sm text-[#d8e2ef] mb-2">You can update this event's data at any time. Some tips:</p>
              <ul className="list-disc pl-5 text-sm text-[#d8e2ef] space-y-1">
                <li>Click section headers to expand or collapse sections</li>
                <li>Financial data can be added later as it becomes available</li>
                <li>The event status will automatically update to "Complete" when financial data is added</li>
                <li>All changes are saved immediately when you click the Save button</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
