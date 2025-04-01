"use client"

import ProtectedRoute from "@/components/protected-route"
import DataEntryForm from "@/app/data-entry/data-entry-form"

export default function DataEntryPage() {
  return (
    <ProtectedRoute>
      <DataEntryForm />
    </ProtectedRoute>
  )
}

