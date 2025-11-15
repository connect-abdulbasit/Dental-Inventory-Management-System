"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, CheckCircle, Mail, Store } from "lucide-react"

export default function InvitationAcceptancePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const email = searchParams.get("email")
  const clinicId = searchParams.get("clinicId")
  const clinicName = searchParams.get("clinicName")

  useEffect(() => {
    if (!email || !clinicId || !clinicName) {
      router.push("/signup")
    }
  }, [email, clinicId, clinicName, router])

  const handleAccept = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Get user data from sessionStorage
      const pendingSignup = sessionStorage.getItem("pending_signup")
      if (!pendingSignup) {
        setError("Signup data not found. Please start over.")
        setIsLoading(false)
        return
      }

      const userData = JSON.parse(pendingSignup)

      // Create user account
      const signupResponse = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...userData,
          clinicId, // Link user to the clinic
        }),
      })

      const signupData = await signupResponse.json()

      if (!signupResponse.ok) {
        setError(signupData.error || "Failed to accept invitation. Please try again.")
        setIsLoading(false)
        return
      }

      // Accept invitation
      const acceptResponse = await fetch("/api/signup/accept-invitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          clinicId: clinicId,
        }),
      })

      if (!acceptResponse.ok) {
        setError("Failed to accept invitation. Please try again.")
        setIsLoading(false)
        return
      }

      // Clear pending signup data
      sessionStorage.removeItem("pending_signup")

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      setError("Failed to accept invitation. Please try again.")
      setIsLoading(false)
    }
  }

  const handleDecline = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Get user data from sessionStorage
      const pendingSignup = sessionStorage.getItem("pending_signup")
      if (!pendingSignup) {
        setError("Signup data not found. Please start over.")
        setIsLoading(false)
        return
      }

      const userData = JSON.parse(pendingSignup)

      // Create user account (they already signed up)
      const signupResponse = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...userData,
          // Don't link to clinic since they're declining
        }),
      })

      const signupData = await signupResponse.json()

      if (!signupResponse.ok) {
        setError(signupData.error || "Failed to create account. Please try again.")
        setIsLoading(false)
        return
      }

      // Decline/cancel invitation
      const declineResponse = await fetch("/api/signup/decline-invitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          clinicId: clinicId,
        }),
      })

      if (!declineResponse.ok) {
        const errorData = await declineResponse.json()
        setError(errorData.error || "Failed to decline invitation. Please try again.")
        setIsLoading(false)
        return
      }

      // User data is still in sessionStorage for clinic onboarding
      // Redirect to clinic onboarding
      router.push("/signup/clinic-onboarding")
    } catch (err) {
      setError("Failed to decline invitation. Please try again.")
      setIsLoading(false)
    }
  }

  if (!email || !clinicId || !clinicName) {
    return null
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Grid Background Pattern - Primary */}
      <div className="absolute inset-0 grid-pattern-primary bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Grid Background Pattern - Secondary */}
      <div className="absolute inset-0 grid-pattern-secondary bg-[size:1.5rem_1.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Hero Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 animate-gradient-shift" />
      
      {/* Decorative Blur Circles */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      
      {/* Additional Bubbles */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-400/20 rounded-full blur-2xl animate-blob animation-delay-2000" />
      <div className="absolute top-60 left-1/3 w-28 h-28 bg-purple-400/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      <div className="absolute bottom-32 right-1/4 w-20 h-20 bg-pink-400/20 rounded-full blur-2xl animate-blob animation-delay-1000" />
      <div className="absolute bottom-20 left-1/2 w-36 h-36 bg-cyan-400/20 rounded-full blur-3xl animate-blob animation-delay-3000" />
      
      {/* Floating Particles */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-500/30 rounded-full animate-float" />
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-purple-500/30 rounded-full animate-float animation-delay-2000" />
      <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-cyan-500/30 rounded-full animate-float animation-delay-4000" />
      <div className="absolute top-2/3 right-1/4 w-2.5 h-2.5 bg-blue-500/20 rounded-full animate-float animation-delay-1000" />

      <div className="relative flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              You've Been Invited!
            </h2>
            <p className="text-lg text-gray-600 font-medium">
              Join a dental practice team
            </p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                Clinic Invitation
              </CardTitle>
              <CardDescription>
                You have been invited to join a clinic
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600 mb-2">You've been invited to join:</p>
                  <p className="text-2xl font-bold text-blue-900">{clinicName}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Email:</p>
                  <p className="font-medium">{email}</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900 mb-1">
                        What happens next?
                      </p>
                      <p className="text-sm text-green-700">
                        By accepting this invitation, you'll be added to the clinic's team and gain access to their dental practice management system.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDecline}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Store className="w-4 h-4 mr-2" />
                      Decline & Create Own Clinic
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={handleAccept}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Accept Invitation
                    </>
                  )}
                </Button>
              </div>

              <div className="text-center text-sm text-gray-500">
                <p>
                  Declining this invitation will allow you to create your own clinic instead.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

