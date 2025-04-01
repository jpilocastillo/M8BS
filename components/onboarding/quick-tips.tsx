"use client"

import { useState } from "react"
import { X, Lightbulb, ChevronRight, ChevronLeft } from "lucide-react"

interface QuickTip {
  title: string
  content: string
}

const tips: QuickTip[] = [
  {
    title: "Track Your Seminars",
    content: "Add all your seminar events in the Data Management section to get the most accurate analytics.",
  },
  {
    title: "Complete Your Events",
    content: "Remember to mark events as 'Complete' and add attendance data after each seminar.",
  },
  {
    title: "Compare Performance",
    content: "Use the Analytics page to compare performance across different seminars and time periods.",
  },
  {
    title: "Export Reports",
    content: "Need to share data with your team? Use the Export feature to download your data as CSV.",
  },
]

export default function QuickTips() {
  const [currentTip, setCurrentTip] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) {
    return null
  }

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem("tipsDismissed", "true")
  }

  const handleNext = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length)
  }

  const handlePrev = () => {
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length)
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-[#0a0a29] border border-[#215cac]/40 rounded-lg shadow-lg z-50 overflow-hidden">
      <div className="bg-gradient-to-r from-[#2c7be5] to-[#27bcfd] p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-white" />
          <h3 className="font-bold text-white">Quick Tip</h3>
        </div>
        <button onClick={handleDismiss} className="text-white hover:text-white/80 transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="p-4">
        <h4 className="font-bold text-white mb-2">{tips[currentTip].title}</h4>
        <p className="text-[#d8e2ef] text-sm">{tips[currentTip].content}</p>
      </div>
      <div className="flex items-center justify-between p-3 border-t border-[#215cac]/20">
        <div className="flex items-center gap-1">
          {tips.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 w-1.5 rounded-full ${index === currentTip ? "bg-[#2c7be5]" : "bg-[#215cac]/40"}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePrev} className="p-1 rounded-full hover:bg-[#215cac]/20 transition-colors">
            <ChevronLeft className="h-4 w-4 text-[#d8e2ef]" />
          </button>
          <button onClick={handleNext} className="p-1 rounded-full hover:bg-[#215cac]/20 transition-colors">
            <ChevronRight className="h-4 w-4 text-[#d8e2ef]" />
          </button>
        </div>
      </div>
    </div>
  )
}

