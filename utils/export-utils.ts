// Convert JSON data to CSV format
export function convertToCSV(objArray: any) {
  const array = typeof objArray != "object" ? JSON.parse(objArray) : objArray

  let str = ""
  for (let i = 0; i < array.length; i++) {
    let line = ""
    for (const index in array[i]) {
      if (line != "") line += ","

      line += array[i][index]
    }

    str += line + "\r\n"
  }

  return str
}

// Format event data for export
export function formatEventDataForExport(event: any) {
  return {
    "Event #": event.event || "",
    "Event Date": event.eventDate || "",
    "Event Location": event.eventLocation || "",
    "Day of Week": event.dayOfWeek || "",
    "Event Time": event.eventTime || "",
    "Advertising Cost": event.advertisingCost || 0,
    "Food/Venue Cost": event.foodVenueCost || 0,
    "Type of Marketing": event.typeOfMarketing || "",
    "Topic of Marketing": event.topicOfMarketing || "",
    "Audience Demographics (Age)": event.audienceDemographicsAge || "",
    "Audience Total": event.audienceTotal || 0,
    "Registrant Responses": event.registrantResponses || 0,
    Confirmations: event.confirmations || 0,
    Attendees: event.attendees || 0,
    "Not Booked": event.notBooked || 0,
    "Non-Attendees": event.nonAttendees || 0,
    "1st Appointments from Event": event.firstAppointmentsFromEvent || 0,
    "Set at Event": event.setAtEvent || 0,
    "Set After Event": event.setAfterEvent || 0,
    "Total Appointments": event.totalAppointments || 0,
    "1st Appointments Attended": event.firstAppointmentsAttended || 0,
    "1st Appointment No Shows": event.firstApptNoShows || 0,
    "2nd Appointment Attended": event.secondAppointmentAttended || 0,
    "Clients from Event": event.clientsFromEvent || 0,
    "Fixed Annuity Production": event.fixedAnnuityProduction || 0,
    "# of Annuities Sold": event.numAnnuitiesSold || 0,
    "Life Production": event.lifeProduction || 0,
    "# of Life Policies Sold": event.numLifePoliciesSold || 0,
    "# of Financial Planning Fees": event.numFinancialPlanningFees || 0,
    "AUM Total": event.aumTotal || 0,
    "# of AUM Clients": event.numAumClients || 0,
    "Total Expense": event.totalExpense || 0,
    "Expense per Buying Unit": event.expensePerBuyingUnit || 0,
    "Expense per 1st Appointment": event.expensePerFirstAppointment || 0,
    "Client Acquisition Cost": event.clientAcquisitionCost || 0,
    "Fixed Annuity Production Income": event.fixedAnnuityProductionIncome || 0,
    "Fixed Life Production Income": event.fixedLifeProductionIncome || 0,
    "Financial Planning Income": event.financialPlanningIncome || 0,
    "AUM Income": event.aumIncome || 0,
    "Total Income 1st Year": event.totalIncomeFirstYear || 0,
  }
}

// Download CSV file
export function downloadCSV(csvContent: string, fileName: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")

  // Create a URL for the blob
  const url = URL.createObjectURL(blob)

  // Set link properties
  link.setAttribute("href", url)
  link.setAttribute("download", fileName)
  link.style.visibility = "hidden"

  // Append to the document
  document.body.appendChild(link)

  // Trigger the download
  link.click()

  // Clean up
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

