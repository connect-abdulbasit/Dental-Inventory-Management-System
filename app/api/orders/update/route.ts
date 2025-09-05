import { NextResponse, type NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const { orderId, status } = await request.json()

  if (!orderId || !status) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Simulate successful update
  const result = {
    success: true,
    message: `Order ${orderId} marked as ${status}`,
    orderId,
    newStatus: status,
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json(result)
}
