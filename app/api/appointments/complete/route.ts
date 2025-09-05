import { NextResponse, type NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const { appointmentId, notes } = await request.json()

  if (!appointmentId) {
    return NextResponse.json({ error: "Appointment ID is required" }, { status: 400 })
  }

  // Simulate completing the appointment
  const result = {
    success: true,
    message: "Appointment marked as completed",
    appointmentId,
    completedAt: new Date().toISOString(),
    notes: notes || "",
  }

  return NextResponse.json(result)
}
