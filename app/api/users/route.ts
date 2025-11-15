import { NextResponse } from "next/server"

// Dummy users data
const users = [
  {
    id: "1",
    email: "admin@cavity.com",
    name: "Admin User",
    role: "clinic_admin",
    status: "active",
    createdAt: "2024-01-15",
    lastLogin: "2024-01-20",
  },
  {
    id: "2",
    email: "dr.smith@cavity.com",
    name: "Dr. Smith",
    role: "clinic_member",
    status: "active",
    createdAt: "2024-01-10",
    lastLogin: "2024-01-19",
  },
  {
    id: "3",
    email: "nurse.jane@cavity.com",
    name: "Jane Doe",
    role: "clinic_member",
    status: "active",
    createdAt: "2024-01-12",
    lastLogin: "2024-01-18",
  },
  {
    id: "4",
    email: "receptionist@cavity.com",
    name: "Mike Johnson",
    role: "clinic_member",
    status: "pending",
    createdAt: "2024-01-20",
    lastLogin: null,
  },
]

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json({
    success: true,
    users: users,
  })
}

export async function POST(request: Request) {
  const body = await request.json()

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const newUser = {
    id: (users.length + 1).toString(),
    email: body.email,
    name: body.name || body.email.split("@")[0],
    role: body.role || "clinic_member",
    status: "pending",
    createdAt: new Date().toISOString().split("T")[0],
    lastLogin: null,
  }

  users.push(newUser)

  return NextResponse.json({
    success: true,
    message: "User invited successfully",
    user: newUser,
  })
}
