"use client"

import { useDateSelection } from "@/contexts/date-selection-context"

export default function EventDetails() {
  // Import the useDateSelection hook
  const { selectedDate } = useDateSelection()

  // Get the event data for the selected date
  const getSelectedData = () => {
    const eventData = {
      all: {
        dayOfWeek: "Thursday",
        location: "Vino Grille",
        eventTime: "6:00 PM",
        audienceDemographicsAge: "58-71",
        mileRadius: "10-15 Mi",
        incomeProducingAssets: "500k-2m",
      },
      "event-1": {
        dayOfWeek: "Monday",
        location: "Downtown Conference Center",
        eventTime: "5:30 PM",
        audienceDemographicsAge: "55-68",
        mileRadius: "8-12 Mi",
        incomeProducingAssets: "400k-1.5m",
      },
      "event-2": {
        dayOfWeek: "Wednesday",
        location: "Parkside Hotel",
        eventTime: "6:30 PM",
        audienceDemographicsAge: "60-72",
        mileRadius: "12-18 Mi",
        incomeProducingAssets: "600k-2.5m",
      },
      "event-3": {
        dayOfWeek: "Tuesday",
        location: "Lakeview Restaurant",
        eventTime: "7:00 PM",
        audienceDemographicsAge: "52-65",
        mileRadius: "5-10 Mi",
        incomeProducingAssets: "350k-1.2m",
      },
      "event-4": {
        dayOfWeek: "Friday",
        location: "Grand Conference Hall",
        eventTime: "5:00 PM",
        audienceDemographicsAge: "62-75",
        mileRadius: "15-20 Mi",
        incomeProducingAssets: "750k-3m",
      },
      "event-5": {
        dayOfWeek: "Thursday",
        location: "Seaside Restaurant",
        eventTime: "6:15 PM",
        audienceDemographicsAge: "57-70",
        mileRadius: "10-15 Mi",
        incomeProducingAssets: "500k-2m",
      },
      "event-6": {
        dayOfWeek: "Saturday",
        location: "Mountain View Hotel",
        eventTime: "4:30 PM",
        audienceDemographicsAge: "59-73",
        mileRadius: "12-18 Mi",
        incomeProducingAssets: "650k-2.8m",
      },
      "event-7": {
        dayOfWeek: "Monday",
        location: "City Center Venue",
        eventTime: "6:45 PM",
        audienceDemographicsAge: "54-67",
        mileRadius: "7-12 Mi",
        incomeProducingAssets: "450k-1.8m",
      },
      "event-8": {
        dayOfWeek: "Wednesday",
        location: "Riverside Conference Center",
        eventTime: "6:00 PM",
        audienceDemographicsAge: "56-69",
        mileRadius: "9-14 Mi",
        incomeProducingAssets: "500k-2.2m",
      },
      "event-9": {
        dayOfWeek: "Thursday",
        location: "Vino Grille",
        eventTime: "6:00 PM",
        audienceDemographicsAge: "58-71",
        mileRadius: "10-15 Mi",
        incomeProducingAssets: "500k-2m",
      },
    }

    return eventData[selectedDate] || eventData.all
  }

  const eventData = getSelectedData()

  return (
    <div className="mb-6 overflow-hidden rounded-lg bg-gradient-to-br from-[#0a0a29] to-[#0c0c35] border border-[#215cac]/20 shadow-lg shadow-[#2c7be5]/5">
      <div className="grid grid-cols-1 divide-y lg:grid-cols-3 lg:divide-x lg:divide-y-0 divide-[#215cac]/20">
        <div className="p-6 transition-all duration-300 hover:bg-[#215cac]/10">
          <h3 className="mb-2 text-base font-bold text-white">Day of the Week</h3>
          <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
            {eventData.dayOfWeek}
          </div>
        </div>
        <div className="p-6 transition-all duration-300 hover:bg-[#215cac]/10">
          <h3 className="mb-2 text-base font-bold text-white">Event Location</h3>
          <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
            {eventData.location}
          </div>
        </div>
        <div className="p-6 transition-all duration-300 hover:bg-[#215cac]/10">
          <h3 className="mb-2 text-base font-bold text-white">Event Time</h3>
          <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
            {eventData.eventTime}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 divide-y lg:grid-cols-3 lg:divide-x lg:divide-y-0 divide-[#215cac]/20 border-t border-[#215cac]/20">
        <div className="p-6 transition-all duration-300 hover:bg-[#215cac]/10">
          <h3 className="mb-2 text-base font-bold text-white">Age Range</h3>
          <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
            {eventData.audienceDemographicsAge}
          </div>
        </div>
        <div className="p-6 transition-all duration-300 hover:bg-[#215cac]/10">
          <h3 className="mb-2 text-base font-bold text-white">Mile Radius</h3>
          <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
            {eventData.mileRadius}
          </div>
        </div>
        <div className="p-6 transition-all duration-300 hover:bg-[#215cac]/10">
          <h3 className="mb-2 text-base font-bold text-white">Income Producing Assets</h3>
          <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
            {eventData.incomeProducingAssets}
          </div>
        </div>
      </div>
    </div>
  )
}

