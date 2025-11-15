"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { 
  User, 
  CheckCircle,
  Star,
  Store,
  Stethoscope
} from "lucide-react"

interface UserData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  userType: "clinic" | "supplier" | ""
}


export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    userType: ""
  })


  const steps = [
    { number: 1, title: "Account Info", icon: User },
  ]

  const handleUserDataChange = (field: keyof UserData, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }))
  }

  const validateStep = (step: number): boolean => {
    setError("")
    
    switch (step) {
      case 1:
        if (!userData.firstName || !userData.lastName || !userData.email || !userData.password || !userData.userType) {
          setError("Please fill in all required fields")
          return false
        }
        if (userData.password !== userData.confirmPassword) {
          setError("Passwords do not match")
          return false
        }
        if (userData.password.length < 6) {
          setError("Password must be at least 6 characters long")
          return false
        }
        if (!userData.email.includes("@")) {
          setError("Please enter a valid email address")
          return false
        }
        return true
      
      default:
        return true
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(1)) return

    setIsLoading(true)
    setError("")

    try {
      // Check if user is invited (for clinic users)
      if (userData.userType === "clinic") {
        const inviteCheck = await fetch("/api/signup/check-invitation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userData.email }),
        })

        const inviteData = await inviteCheck.json()
        
        if (inviteData.invited && inviteData.invitation) {
          // Store user data temporarily for invitation acceptance
          sessionStorage.setItem("pending_signup", JSON.stringify({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: userData.password,
            phone: userData.phone,
            userType: userData.userType,
          }))
          // User is invited, redirect to invitation acceptance page
          router.push(`/signup/invitation?email=${encodeURIComponent(userData.email)}&clinicId=${inviteData.invitation.clinicId}&clinicName=${encodeURIComponent(inviteData.invitation.clinicName)}`)
          return
        }
      }

      // Store user data temporarily for onboarding
      sessionStorage.setItem("pending_signup", JSON.stringify({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        userType: userData.userType,
      }))

      // Create user account
      const signupResponse = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: userData.password,
          phone: userData.phone,
          userType: userData.userType,
        }),
      })

      const signupData = await signupResponse.json()

      if (!signupResponse.ok) {
        setError(signupData.error || "Failed to create account. Please try again.")
        sessionStorage.removeItem("pending_signup")
        return
      }

      // Redirect based on user type
      if (userData.userType === "clinic") {
        router.push("/signup/clinic-onboarding")
      } else if (userData.userType === "supplier") {
        router.push("/signup/supplier-onboarding")
      }
    } catch (err) {
      setError("Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={userData.firstName}
                  onChange={(e) => handleUserDataChange("firstName", e.target.value)}
                  placeholder="Ahmed"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={userData.lastName}
                  onChange={(e) => handleUserDataChange("lastName", e.target.value)}
                  placeholder="Ali"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={userData.email}
                onChange={(e) => handleUserDataChange("email", e.target.value)}
                  placeholder="ahmed.ali@example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={userData.phone}
                onChange={(e) => handleUserDataChange("phone", e.target.value)}
                  placeholder="+92 300 1234567"
                required
              />
            </div>

            <div>
              <Label htmlFor="userType">I am a *</Label>
              <Select value={userData.userType} onValueChange={(value) => handleUserDataChange("userType", value as "clinic" | "supplier")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clinic">
                    <span className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4" />
                      Clinic
                    </span>
                  </SelectItem>
                  <SelectItem value="supplier">
                    <span className="flex items-center gap-2">
                      <Store className="w-4 h-4" />
                      Supplier
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={userData.password}
                  onChange={(e) => handleUserDataChange("password", e.target.value)}
                  placeholder="Create a strong password"
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={userData.confirmPassword}
                  onChange={(e) => handleUserDataChange("confirmPassword", e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>
          </div>
        )


      default:
        return null
    }
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
              <span className="text-white font-bold text-3xl">D</span>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">Join Dentura</h2>
            <p className="text-lg text-gray-600 font-medium">Create your dental practice management account</p>
          </div>

        {/* Progress Bar */}
        <div className="space-y-4">
          <div className="flex justify-center items-center">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.number
              const isCompleted = currentStep > step.number
              
              return (
                <div key={step.number} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    isCompleted 
                      ? "bg-green-500 border-green-500 text-white" 
                      : isActive 
                        ? "bg-blue-600 border-blue-600 text-white" 
                        : "bg-white border-gray-300 text-gray-400"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`text-xs mt-2 ${isActive ? "text-blue-600 font-medium" : "text-gray-500"}`}>
                    {step.title}
                  </span>
                </div>
              )
            })}
          </div>
          <Progress value={100} className="h-2" />
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              {(() => {
                const Icon = steps[currentStep - 1].icon;
                return Icon ? (
                  <Icon className="w-5 h-5 mr-2 text-blue-600" />
                ) : null;
              })()}
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Create your account to get started"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {renderStepContent()}

            <div className="flex justify-end mt-8">
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4 mr-2" />
                    Continue
                  </>
                )}
              </Button>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="text-blue-600 hover:underline font-medium">
                  Sign in here
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}
