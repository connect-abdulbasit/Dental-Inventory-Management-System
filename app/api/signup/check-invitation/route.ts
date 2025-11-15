import { NextResponse } from "next/server"

// In-memory storage for invitations (in production, this would be in a database)
// Format: { email: string, clinicId: string, clinicName: string, invitedBy: string, status: 'pending' | 'accepted' | 'cancelled' }
const invitations: Array<{
  email: string
  clinicId: string
  clinicName: string
  invitedBy: string
  status: "pending" | "accepted" | "cancelled"
}> = [
  // Example invitation - in production, this would come from the database
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
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Check if user has a pending invitation
    const invitation = invitations.find(
      (inv) => inv.email.toLowerCase() === email.toLowerCase() && inv.status === "pending"
    )

    if (invitation) {
      return NextResponse.json({
        invited: true,
        invitation: {
          clinicId: invitation.clinicId,
          clinicName: invitation.clinicName,
          invitedBy: invitation.invitedBy,
        },
      })
    }

    return NextResponse.json({
      invited: false,
    })
  } catch (error) {
    console.error("[CHECK_INVITATION_ERROR]", error)
    return NextResponse.json(
      { error: "Unable to check invitation" },
      { status: 500 }
    )
  }
}

