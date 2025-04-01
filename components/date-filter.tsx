"use client"

import { useState, useEffect, useRef } from "react"
import { Calendar, ChevronDown, Check } from "lucide-react"
import { useDateSelection } from "@/contexts/date-selection-context"

type DateOption = {
  id: string
  label: string
  value: string
  dateText: string
}

// This would come from your uploaded data in a real implementation
const uploadedEvents: DateOption[] = [
  { id: "event-1", label: "Apr 15, 2023", value: "2023-04-15", dateText: "Apr 15, 2023" },
  { id: "event-2", label: "May 20, 2023", value: "2023-05-20", dateText: "May 20, 2023" },
  { id: "event-3", label: "Jun 10, 2023", value: "2023-06-10", dateText: "Jun 10, 2023" },
  { id: "event-4", label: "Jul 5, 2023", value: "2023-07-05", dateText: "Jul 5, 2023" },
  { id: "event-5", label: "Aug 18, 2023", value: "2023-08-18", dateText: "Aug 18, 2023" },
  { id: "event-6", label: "Sep 22, 2023", value: "2023-09-22", dateText: "Sep 22, 2023" },
  { id: "event-7", label: "Oct 14, 2023", value: "2023-10-14", dateText: "Oct 14, 2023" },
  { id: "event-8", label: "Nov 30, 2023", value: "2023-11-30", dateText: "Nov 30, 2023" },
  { id: "event-9", label: "Dec 15, 2023", value: "2023-12-15", dateText: "Dec 15, 2023" },
]

export default function DateFilter() {
  const { selectedDate, setSelectedDate } = useDateSelection()
  const [isOpen, setIsOpen] = useState(false)
  const [displayText, setDisplayText] = useState("All Events")
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Add "All Events" option to the beginning of the events list
  const allEvents: DateOption[] = [
    { id: "all", label: "All Events", value: "all", dateText: "All Events" },
    ...uploadedEvents,
  ]

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Update display text when selection changes
  useEffect(() => {
    const selected = allEvents.find((option) => option.id === selectedDate)
    setDisplayText(selected?.label || "All Events")
  }, [selectedDate])

  const handleDateSelect = (id: string) => {
    setSelectedDate(id)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg bg-[#215cac]/20 px-4 py-2 text-white transition-colors hover:bg-[#215cac]/30"
      >
        <Calendar className="h-5 w-5 text-[#2c7be5]" />
        <span className="font-bold">{displayText}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-10 mt-2 w-64 rounded-lg border border-[#215cac]/20 bg-[#0a0a29] p-2 shadow-lg">
          <div className="max-h-[300px] overflow-y-auto">
            {allEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => handleDateSelect(event.id)}
                className={`flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm transition-colors ${
                  selectedDate === event.id
                    ? "bg-[#2c7be5]/20 text-white"
                    : "text-[#5e6e82] hover:bg-[#215cac]/10 hover:text-white"
                }`}
              >
                <div>
                  <div className="font-medium">{event.label}</div>
                  {event.id !== "all" && <div className="text-xs opacity-70">{event.dateText}</div>}
                </div>
                {selectedDate === event.id && <Check className="h-4 w-4 text-[#2c7be5]" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

