// This utility function can be used to test the empty state
// Import it in the dashboard or multi-event-dashboard component and call it
// to simulate an empty data state

export function simulateEmptyState() {
  // In a real app, this would be a state setter function
  // For example: setMultiEventData([])
  console.log("Simulating empty state")
  return []
}

// To restore data:
export function restoreData(originalData: any[]) {
  // In a real app: setMultiEventData(originalData)
  console.log("Restoring data")
  return originalData
}

