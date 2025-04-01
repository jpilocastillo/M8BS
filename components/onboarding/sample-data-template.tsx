"use client"

import { useState } from "react"
import { ArrowRight, FileSpreadsheet, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface SampleDataTemplateProps {
  onComplete?: () => void
}

// Sample data templates
const sampleTemplates = [
  {
    name: "Basic Seminar",
    description: "A template for tracking in-person seminars with basic metrics",
    fields: {
      eventName: "Introduction to Retirement Planning",
      eventType: "Seminar",
      eventDate: new Date().toISOString().split("T")[0],
      location: "Local Community Center",
      topic: "Retirement",
      registrations: 25,
      attendance: 18,
      appointments: 5,
      clients: 2,
      revenue: 15000,
      cost: 1200,
    },
  },
  {
    name: "Advanced Seminar",
    description: "A template for more detailed seminar tracking with follow-up metrics",
    fields: {
      eventName: "Advanced Tax Strategies Seminar",
      eventType: "Seminar",
      eventDate: new Date().toISOString().split("T")[0],
      location: "Hotel Conference Room",
      topic: "Tax Planning",
      registrations: 40,
      attendance: 32,
      appointments: 12,
      clients: 4,
      revenue: 28000,
      cost: 2500,
    },
  },
  {
    name: "Workshop Seminar",
    description: "A template for interactive workshop-style seminars",
    fields: {
      eventName: "Estate Planning Workshop",
      eventType: "Seminar",
      eventDate: new Date().toISOString().split("T")[0],
      location: "Financial Office",
      topic: "Estate Planning",
      registrations: 30,
      attendance: 22,
      appointments: 8,
      clients: 3,
      revenue: 22000,
      cost: 1800,
    },
  },
]

export default function SampleDataTemplate({ onComplete }: SampleDataTemplateProps) {
  const router = useRouter()
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleUseTemplate = async () => {
    if (selectedTemplate === null) return

    setIsLoading(true)

    try {
      // In a real implementation, this would save the template data to Firebase
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mark onboarding as complete
      localStorage.setItem("onboardingComplete", "true")
      localStorage.setItem("hasData", "true")

      setIsComplete(true)

      if (onComplete) {
        onComplete()
      }
    } catch (error) {
      console.error("Error using template:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinue = () => {
    router.push("/dashboard")
  }

  if (isComplete) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center">
        <div className="mb-6 h-20 w-20 rounded-full bg-gradient-to-r from-[#2c7be5] to-[#27bcfd] flex items-center justify-center shadow-lg shadow-[#2c7be5]/30">
          <CheckCircle2 className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Sample Data Added!</h2>
        <p className="text-[#d8e2ef] max-w-2xl mb-8">
          Your sample data has been added successfully. You can now explore the dashboard with this data.
        </p>
        <button
          onClick={handleContinue}
          className="px-6 py-3 bg-gradient-to-r from-[#2c7be5] to-[#27bcfd] text-white rounded-md font-bold shadow-lg shadow-[#2c7be5]/20 hover:shadow-[#2c7be5]/40 transition-all duration-300"
        >
          Go to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="rounded-lg bg-[#0a0a29]/80 border border-[#215cac]/20 p-8 backdrop-blur-sm shadow-xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-6 h-20 w-20 rounded-full bg-[#215cac]/20 flex items-center justify-center">
              <FileSpreadsheet className="h-10 w-10 text-[#27bcfd]" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Start with Sample Data</h2>
            <p className="text-[#d8e2ef] max-w-2xl mb-4">
              Choose a template below to quickly populate your dashboard with sample data. This will help you understand
              how the dashboard works with real data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {sampleTemplates.map((template, index) => (
              <div
                key={index}
                className={`bg-[#050117]/50 p-6 rounded-lg border cursor-pointer transition-all duration-300 ${
                  selectedTemplate === index
                    ? "border-[#2c7be5] shadow-lg shadow-[#2c7be5]/10"
                    : "border-[#215cac]/20 hover:border-[#215cac]/40"
                }`}
                onClick={() => setSelectedTemplate(index)}
              >
                <div className="flex items-start mb-4">
                  <div
                    className={`h-5 w-5 rounded-full border mr-2 flex items-center justify-center ${
                      selectedTemplate === index ? "border-[#2c7be5] bg-[#2c7be5]" : "border-[#5e6e82]"
                    }`}
                  >
                    {selectedTemplate === index && <div className="h-2 w-2 rounded-full bg-white"></div>}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-left">{template.name}</h3>
                    <p className="text-sm text-[#d8e2ef]/80 text-left">{template.description}</p>
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-xs text-[#5e6e82]">Event Type:</span>
                    <span className="text-xs text-white">{template.fields.eventType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-[#5e6e82]">Topic:</span>
                    <span className="text-xs text-white">{template.fields.topic}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-[#5e6e82]">Attendance:</span>
                    <span className="text-xs text-white">{template.fields.attendance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-[#5e6e82]">Revenue:</span>
                    <span className="text-xs text-white">${template.fields.revenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleUseTemplate}
              disabled={selectedTemplate === null || isLoading}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2c7be5] to-[#27bcfd] text-white rounded-md font-bold shadow-lg shadow-[#2c7be5]/20 hover:shadow-[#2c7be5]/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Use This Template <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
            <button
              onClick={() => router.push("/data-management/new")}
              className="px-6 py-3 bg-[#215cac]/20 text-white rounded-md font-bold hover:bg-[#215cac]/30 transition-all duration-300"
            >
              Start From Scratch
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

