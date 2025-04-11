"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type DateSelectionContextType = {
  selectedDate: string
  setSelectedDate: (date: string) => void
}

const DateSelectionContext = createContext<DateSelectionContextType | undefined>(undefined)

export function DateSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<string>("all")

  return (
    <DateSelectionContext.Provider value={{ selectedDate, setSelectedDate }}>{children}</DateSelectionContext.Provider>
  )
}

export function useDateSelection() {
  const context = useContext(DateSelectionContext)
  if (context === undefined) {
    throw new Error("useDateSelection must be used within a DateSelectionProvider")
  }
  return context
}
