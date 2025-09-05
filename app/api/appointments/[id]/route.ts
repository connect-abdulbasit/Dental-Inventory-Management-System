import { NextResponse, type NextRequest } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const appointmentData = await request.json()
  const appointmentId = Number.parseInt(params.id)

  return NextResponse.json({
    success: true,
    message: "Appointment updated successfully",
    appointmentId,
    updatedData: appointmentData,
  })
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const appointmentId = Number.parseInt(params.id)

  return NextResponse.json({
    success: true,
    message: "Appointment deleted successfully",
    appointmentId,
  })
}
