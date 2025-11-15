import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

// In-memory storage for users (in production, this would be in a database)
// This should match your actual user storage structure
const users: Array<{
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  userType: "clinic" | "supplier"
  createdAt: string
}> = []

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password, phone, userType } = await req.json()

    if (!firstName || !lastName || !email || !password || !phone || !userType) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    if (userType !== "clinic" && userType !== "supplier") {
      return NextResponse.json(
        { error: "Invalid user type" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    )

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      userType,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)

    // Determine role based on userType
    // Suppliers get "supplier" role, clinic users get "clinic_admin" role (they are the clinic owner)
    const role = userType === "supplier" ? "supplier" : "clinic_admin"

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        userType: newUser.userType,
        role: role,
      },
    })
  } catch (error) {
    console.error("[SIGNUP_ERROR]", error)
    return NextResponse.json(
      { error: "Unable to create account" },
      { status: 500 }
    )
  }
}

