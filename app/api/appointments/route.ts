import { NextResponse, type NextRequest } from "next/server"

// Shared appointments array (in production, this would be in a database)
// Helper function to get past date
const getPastDate = (daysAgo: number): string => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString().split("T")[0]
}

// Helper function to get past time (hours ago)
const getPastTime = (hoursAgo: number): string => {
  const date = new Date()
  date.setHours(date.getHours() - hoursAgo)
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")
  return `${hours}:${minutes}`
}

export const appointments = [
  {
    id: 1,
    patientName: "John Doe",
    patientEmail: "john.doe@email.com",
    patientPhone: "(555) 123-4567",
    date: getPastDate(1), // Yesterday
    time: getPastTime(2), // 2 hours ago
    duration: 60,
    type: "Cleaning",
    procedureName: "Teeth Cleaning",
    status: "scheduled",
    notes: "Regular checkup and cleaning",
  },
  {
    id: 2,
    patientName: "Jane Smith",
    patientEmail: "jane.smith@email.com",
    patientPhone: "(555) 987-6543",
    date: getPastDate(2), // 2 days ago
    time: "10:30",
    duration: 90,
    type: "Root Canal",
    procedureName: "Root Canal Treatment",
    status: "scheduled",
    notes: "Follow-up for root canal treatment",
  },
  {
    id: 3,
    patientName: "Mike Johnson",
    patientEmail: "mike.johnson@email.com",
    patientPhone: "(555) 456-7890",
    date: getPastDate(0), // Today but past time
    time: getPastTime(3), // 3 hours ago
    duration: 45,
    type: "Consultation",
    procedureName: "Initial Consultation",
    status: "scheduled",
    notes: "New patient consultation",
  },
  {
    id: 4,
    patientName: "Sarah Wilson",
    patientEmail: "sarah.wilson@email.com",
    patientPhone: "(555) 321-0987",
    date: getPastDate(3), // 3 days ago
    time: "11:00",
    duration: 120,
    type: "Surgery",
    procedureName: "Wisdom Tooth Extraction",
    status: "scheduled",
    notes: "Wisdom tooth extraction",
  },
  {
    id: 5,
    patientName: "David Brown",
    patientEmail: "david.brown@email.com",
    patientPhone: "(555) 654-3210",
    date: getPastDate(5), // 5 days ago
    time: "15:30",
    duration: 60,
    type: "Filling",
    procedureName: "Cavity Filling",
    status: "completed",
    notes: "Cavity filling completed",
  },
  {
    id: 6,
    patientName: "Emily Davis",
    patientEmail: "emily.davis@email.com",
    patientPhone: "(555) 111-2222",
    date: getPastDate(4), // 4 days ago
    time: "14:00",
    duration: 30,
    type: "Checkup",
    procedureName: "Routine Checkup",
    status: "cancelled",
    notes: "Patient cancelled",
  },
]

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return NextResponse.json(appointments)
}

export async function POST(request: NextRequest) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const appointmentData = await request.json()

  const newAppointment = {
    id: Math.max(...appointments.map((a) => a.id)) + 1,
    ...appointmentData,
    status: "scheduled",
  }

  appointments.push(newAppointment)

  return NextResponse.json({
    success: true,
    message: "Appointment created successfully",
    appointment: newAppointment,
  })
}
