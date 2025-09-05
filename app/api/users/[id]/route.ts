import { NextResponse } from "next/server"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json()

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json({
    success: true,
    message: `User ${params.id} updated successfully`,
    user: {
      id: params.id,
      ...body,
    },
  })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json({
    success: true,
    message: `User ${params.id} deleted successfully`,
  })
}
