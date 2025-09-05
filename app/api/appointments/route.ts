import { NextResponse, type NextRequest } from "next/server"

const appointments = [
  {
    id: 1,
    patientName: "John Doe",
    patientEmail: "john.doe@email.com",
    patientPhone: "(555) 123-4567",
    date: "2024-01-20",
    time: "09:00",
    duration: 60,
    type: "Cleaning",
    status: "scheduled",
    notes: "Regular checkup and cleaning",
  },
  {
    id: 2,
    patientName: "Jane Smith",
    patientEmail: "jane.smith@email.com",
    patientPhone: "(555) 987-6543",
    date: "2024-01-20",
    time: "10:30",
    duration: 90,
    type: "Root Canal",
    status: "scheduled",
    notes: "Follow-up for root canal treatment",
  },
  {
    id: 3,
    patientName: "Mike Johnson",
    patientEmail: "mike.johnson@email.com",
    patientPhone: "(555) 456-7890",
    date: "2024-01-21",
    time: "14:00",
    duration: 45,
    type: "Consultation",
    status: "scheduled",
    notes: "New patient consultation",
  },
  {
    id: 4,
    patientName: "Sarah Wilson",
    patientEmail: "sarah.wilson@email.com",
    patientPhone: "(555) 321-0987",
    date: "2024-01-22",
    time: "11:00",
    duration: 120,
    type: "Surgery",
    status: "scheduled",
    notes: "Wisdom tooth extraction",
  },
  {
    id: 5,
    patientName: "David Brown",
    patientEmail: "david.brown@email.com",
    patientPhone: "(555) 654-3210",
    date: "2024-01-19",
    time: "15:30",
    duration: 60,
    type: "Filling",
    status: "completed",
    notes: "Cavity filling completed",
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
