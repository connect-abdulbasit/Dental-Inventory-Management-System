import { NextResponse } from "next/server"

// In-memory storage for invitations (in production, this would be in a database)
const invitations: Array<{
  email: string
  clinicId: string
  clinicName: string
  invitedBy: string
  status: "pending" | "accepted" | "cancelled"
}> = []

export async function POST(req: Request) {
  try {
    const { email, clinicId } = await req.json()

    if (!email || !clinicId) {
      return NextResponse.json(
        { error: "Email and clinic ID are required" },
        { status: 400 }
      )
    }

    // Find and update invitation status
    const invitation = invitations.find(
      (inv) => inv.email.toLowerCase() === email.toLowerCase() && inv.clinicId === clinicId
    )

    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      )
    }

    if (invitation.status === "accepted") {
      return NextResponse.json(
        { error: "Invitation already accepted" },
        { status: 400 }
      )
    }

    // Update invitation status
    invitation.status = "accepted"

    // In production, update the database here
    // Also link the user to the clinic in the database

    return NextResponse.json({
      success: true,
      message: "Invitation accepted successfully",
    })
  } catch (error) {
    console.error("[ACCEPT_INVITATION_ERROR]", error)
    return NextResponse.json(
      { error: "Unable to accept invitation" },
      { status: 500 }
    )
  }
}

