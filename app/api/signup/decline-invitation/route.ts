import { NextResponse } from "next/server"

// In-memory storage for invitations (in production, this would be in a database)
// This should match the same storage used in check-invitation and accept-invitation
const invitations: Array<{
  email: string
  clinicId: string
  clinicName: string
  invitedBy: string
  status: "pending" | "accepted" | "cancelled"
}> = [
  {
    email: "invited@example.com",
    clinicId: "1",
    clinicName: "Bright Smile Dental",
    invitedBy: "Dr. Smith",
    status: "pending"
  }
]

export async function POST(req: Request) {
  try {
    const { email, clinicId } = await req.json()

    if (!email || !clinicId) {
      return NextResponse.json(
        { error: "Email and clinic ID are required" },
        { status: 400 }
      )
    }

    // Find and update invitation status to cancelled
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

    // Update invitation status to cancelled
    invitation.status = "cancelled"

    // In production, update the database here

    return NextResponse.json({
      success: true,
      message: "Invitation cancelled successfully",
    })
  } catch (error) {
    console.error("[DECLINE_INVITATION_ERROR]", error)
    return NextResponse.json(
      { error: "Unable to decline invitation" },
      { status: 500 }
    )
  }
}

