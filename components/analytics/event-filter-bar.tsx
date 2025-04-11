"use client"

import { useState } from "react"
import { Filter, Calendar, ChevronDown, X } from "lucide-react"

interface EventFilterBarProps {
  topics: string[]
  locations: string[]
  dateRange: { start: string; end: string }
  setDateRange: (range: { start: string; end: string }) => void
  selectedTopics: string[]
  setSelectedTopics: (topics: string[]) => void
  selectedLocations: string[]
  setSelectedLocations: (locations: string[]) => void
}

export default function EventFilterBar({
  topics,
  locations,
  dateRange,
  setDateRange,
  selectedTopics,
  setSelectedTopics,
  selectedLocations,
  setSelectedLocations,
}: EventFilterBarProps) {
  const [showTopicDropdown, setShowTopicDropdown] = useState(false)
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [showDateDropdown, setShowDateDropdown] = useState(false)

  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic))
    } else {
      setSelectedTopics([...selectedTopics, topic])
    }
  }

  const toggleLocation = (location: string) => {
    if (selectedLocations.includes(location)) {
      setSelectedLocations(selectedLocations.filter((l) => l !== location))
    } else {
      setSelectedLocations([...selectedLocations, location])
    }
  }

  const clearFilters = () => {
    setSelectedTopics([])
    setSelectedLocations([])
    setDateRange({ start: "2023-01-01", end: "2024-12-31" })
  }

  return (
    <div className="mb-6 bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] p-4 rounded-lg border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <button
              onClick={() => {
                setShowTopicDropdown(!showTopicDropdown)
                setShowLocationDropdown(false)
                setShowDateDropdown(false)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md text-white hover:bg-[#215cac]/20 transition-colors"
            >
              <Filter className="h-4 w-4 text-[#5e6e82]" />
              <span>Topic</span>
              <ChevronDown className="h-4 w-4 text-[#5e6e82]" />
            </button>
            {showTopicDropdown && (
              <div className="absolute left-0 mt-2 w-64 bg-[#0a0a29] border border-[#215cac]/40 rounded-md shadow-lg z-10">
                <div className="p-2">
                  <div className="max-h-60 overflow-y-auto">
                    {topics.map((topic) => (
                      <div key={topic} className="flex items-center p-2 hover:bg-[#215cac]/20 rounded-md">
                        <input
                          type="checkbox"
                          id={`topic-${topic}`}
                          checked={selectedTopics.includes(topic)}
                          onChange={() => toggleTopic(topic)}
                          className="h-4 w-4 rounded border-[#215cac]/40 bg-[#050117] text-[#2c7be5] focus:ring-[#2c7be5]"
                        />
                        <label htmlFor={`topic-${topic}`} className="ml-2 text-sm text-white cursor-pointer">
                          {topic}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowLocationDropdown(!showLocationDropdown)
                setShowTopicDropdown(false)
                setShowDateDropdown(false)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md text-white hover:bg-[#215cac]/20 transition-colors"
            >
              <Filter className="h-4 w-4 text-[#5e6e82]" />
              <span>Location</span>
              <ChevronDown className="h-4 w-4 text-[#5e6e82]" />
            </button>
            {showLocationDropdown && (
              <div className="absolute left-0 mt-2 w-64 bg-[#0a0a29] border border-[#215cac]/40 rounded-md shadow-lg z-10">
                <div className="p-2">
                  <div className="max-h-60 overflow-y-auto">
                    {locations.map((location) => (
                      <div key={location} className="flex items-center p-2 hover:bg-[#215cac]/20 rounded-md">
                        <input
                          type="checkbox"
                          id={`location-${location}`}
                          checked={selectedLocations.includes(location)}
                          onChange={() => toggleLocation(location)}
                          className="h-4 w-4 rounded border-[#215cac]/40 bg-[#050117] text-[#2c7be5] focus:ring-[#2c7be5]"
                        />
                        <label htmlFor={`location-${location}`} className="ml-2 text-sm text-white cursor-pointer">
                          {location}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowDateDropdown(!showDateDropdown)
                setShowTopicDropdown(false)
                setShowLocationDropdown(false)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md text-white hover:bg-[#215cac]/20 transition-colors"
            >
              <Calendar className="h-4 w-4 text-[#5e6e82]" />
              <span>Date Range</span>
              <ChevronDown className="h-4 w-4 text-[#5e6e82]" />
            </button>
            {showDateDropdown && (
              <div className="absolute left-0 mt-2 w-72 bg-[#0a0a29] border border-[#215cac]/40 rounded-md shadow-lg z-10 p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Start Date</label>
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">End Date</label>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                      className="w-full px-3 py-2 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(selectedTopics.length > 0 || selectedLocations.length > 0) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-1 bg-[#e63757]/10 text-[#e63757] rounded-md hover:bg-[#e63757]/20 transition-colors"
            >
              <X className="h-3 w-3" />
              <span className="text-sm">Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Active filters display */}
      {(selectedTopics.length > 0 || selectedLocations.length > 0) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedTopics.map((topic) => (
            <div key={topic} className="flex items-center gap-1 px-2 py-1 bg-[#2c7be5]/20 text-white rounded-md">
              <span className="text-xs">Topic: {topic}</span>
              <button onClick={() => toggleTopic(topic)} className="text-[#5e6e82] hover:text-white">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {selectedLocations.map((location) => (
            <div key={location} className="flex items-center gap-1 px-2 py-1 bg-[#27bcfd]/20 text-white rounded-md">
              <span className="text-xs">Location: {location}</span>
              <button onClick={() => toggleLocation(location)} className="text-[#5e6e82] hover:text-white">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
