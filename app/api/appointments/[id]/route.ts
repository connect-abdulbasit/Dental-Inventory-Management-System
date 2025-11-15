import { NextResponse, type NextRequest } from "next/server"
import { appointments } from "../route"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const { id } = await params
  const appointmentData = await request.json()
  const appointmentId = Number.parseInt(id)

  // Find and update the appointment
  const appointmentIndex = appointments.findIndex((a) => a.id === appointmentId)
  if (appointmentIndex === -1) {
    return NextResponse.json(
      { error: "Appointment not found" },
      { status: 404 }
    )
  }

  // Update the appointment
  appointments[appointmentIndex] = {
    ...appointments[appointmentIndex],
    ...appointmentData,
  }

  return NextResponse.json({
    success: true,
    message: "Appointment updated successfully",
    appointmentId,
    appointment: appointments[appointmentIndex],
  })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const { id } = await params
  const appointmentId = Number.parseInt(id)

  const appointmentIndex = appointments.findIndex((a) => a.id === appointmentId)
  if (appointmentIndex === -1) {
    return NextResponse.json(
      { error: "Appointment not found" },
      { status: 404 }
    )
  }

  appointments.splice(appointmentIndex, 1)

  return NextResponse.json({
    success: true,
    message: "Appointment deleted successfully",
    appointmentId,
  })
}
