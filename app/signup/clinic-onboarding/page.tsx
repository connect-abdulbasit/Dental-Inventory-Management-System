"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { 
  Building2, 
  CreditCard,
  ArrowRight,
  CheckCircle
} from "lucide-react"

interface ClinicData {
  clinicName: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
  email: string
  website: string
  licenseNumber: string
  establishedYear: string
  description: string
}

interface CardData {
  cardNumber: string
  cardHolder: string
  expiryDate: string
  cvv: string
  billingAddress: string
  billingCity: string
  billingState: string
  billingZip: string
}

export default function ClinicOnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [clinicData, setClinicData] = useState<ClinicData>({
    clinicName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Pakistan",
    phone: "",
    email: "",
    website: "",
    licenseNumber: "",
    establishedYear: "",
    description: ""
  })

  const [cardData, setCardData] = useState<CardData>({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingZip: ""
  })

  const steps = [
    { number: 1, title: "Clinic Details", icon: Building2 },
    { number: 2, title: "Payment Info", icon: CreditCard },
  ]

  const handleClinicDataChange = (field: keyof ClinicData, value: string) => {
    setClinicData(prev => ({ ...prev, [field]: value }))
  }

  const handleCardDataChange = (field: keyof CardData, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }))
  }

  const validateStep = (step: number): boolean => {
    setError("")
    
    switch (step) {
      case 1:
        if (!clinicData.clinicName || !clinicData.address || !clinicData.city || !clinicData.phone) {
          setError("Please fill in all required clinic information")
          return false
        }
        return true
      
      case 2:
        if (!cardData.cardNumber || !cardData.cardHolder || !cardData.expiryDate || !cardData.cvv) {
          setError("Please fill in all required payment information")
          return false
        }
        return true
      
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 2))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(2)) return

    setIsLoading(true)
    setError("")

    try {
      // Save clinic onboarding data
      const response = await fetch("/api/signup/clinic-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinic: clinicData,
          card: cardData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to complete onboarding. Please try again.")
        return
      }

      // Get user data from sessionStorage to set up session
      const pendingSignup = sessionStorage.getItem("pending_signup")
      if (pendingSignup) {
        const userData = JSON.parse(pendingSignup)
        // Set user in localStorage for session
        const user = {
          id: Date.now().toString(),
          email: userData.email,
          name: `${userData.firstName} ${userData.lastName}`,
          role: "clinic_admin", // Clinic owners get clinic_admin role
        }
        localStorage.setItem("cavity_user", JSON.stringify(user))
      }

      // Clear pending signup data
      sessionStorage.removeItem("pending_signup")

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      setError("Failed to complete onboarding. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="clinicName">Clinic Name *</Label>
              <Input
                id="clinicName"
                value={clinicData.clinicName}
                onChange={(e) => handleClinicDataChange("clinicName", e.target.value)}
                placeholder="Karachi Dental Care"
                required
              />
            </div>

            <div>
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                value={clinicData.address}
                onChange={(e) => handleClinicDataChange("address", e.target.value)}
                placeholder="123 Main Boulevard, Block A"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={clinicData.city}
                  onChange={(e) => handleClinicDataChange("city", e.target.value)}
                  placeholder="Karachi"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={clinicData.state}
                  onChange={(e) => handleClinicDataChange("state", e.target.value)}
                  placeholder="Sindh"
                  required
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  value={clinicData.zipCode}
                  onChange={(e) => handleClinicDataChange("zipCode", e.target.value)}
                  placeholder="75500"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="country">Country *</Label>
              <Select value={clinicData.country} onValueChange={(value) => handleClinicDataChange("country", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pakistan">Pakistan</SelectItem>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clinicPhone">Clinic Phone *</Label>
                <Input
                  id="clinicPhone"
                  type="tel"
                  value={clinicData.phone}
                  onChange={(e) => handleClinicDataChange("phone", e.target.value)}
                  placeholder="+92 300 1234567"
                  required
                />
              </div>
              <div>
                <Label htmlFor="clinicEmail">Clinic Email</Label>
                <Input
                  id="clinicEmail"
                  type="email"
                  value={clinicData.email}
                  onChange={(e) => handleClinicDataChange("email", e.target.value)}
                  placeholder="info@karachidental.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={clinicData.website}
                  onChange={(e) => handleClinicDataChange("website", e.target.value)}
                  placeholder="https://www.karachidental.com"
                />
              </div>
              <div>
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  id="licenseNumber"
                  value={clinicData.licenseNumber}
                  onChange={(e) => handleClinicDataChange("licenseNumber", e.target.value)}
                  placeholder="D123456"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="establishedYear">Year Established</Label>
              <Input
                id="establishedYear"
                type="number"
                value={clinicData.establishedYear}
                onChange={(e) => handleClinicDataChange("establishedYear", e.target.value)}
                placeholder="2020"
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>

            <div>
              <Label htmlFor="description">Clinic Description</Label>
              <Textarea
                id="description"
                value={clinicData.description}
                onChange={(e) => handleClinicDataChange("description", e.target.value)}
                placeholder="Tell us about your clinic, specialties, and what makes you unique..."
                rows={4}
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                Your payment information is secure and encrypted. We use industry-standard security measures to protect your data.
              </p>
            </div>

            <div>
              <Label htmlFor="cardNumber">Card Number *</Label>
              <Input
                id="cardNumber"
                value={cardData.cardNumber}
                onChange={(e) => handleCardDataChange("cardNumber", e.target.value)}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
            </div>

            <div>
              <Label htmlFor="cardHolder">Card Holder Name *</Label>
              <Input
                id="cardHolder"
                value={cardData.cardHolder}
                onChange={(e) => handleCardDataChange("cardHolder", e.target.value)}
                placeholder="Ahmed Ali"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  value={cardData.expiryDate}
                  onChange={(e) => handleCardDataChange("expiryDate", e.target.value)}
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV *</Label>
                <Input
                  id="cvv"
                  type="password"
                  value={cardData.cvv}
                  onChange={(e) => handleCardDataChange("cvv", e.target.value)}
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-4">Billing Address</h3>
              
              <div className="mb-4">
                <Label htmlFor="billingAddress">Street Address</Label>
                <Input
                  id="billingAddress"
                  value={cardData.billingAddress}
                  onChange={(e) => handleCardDataChange("billingAddress", e.target.value)}
                  placeholder="123 Main Boulevard, Block A"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="billingCity">City</Label>
                  <Input
                    id="billingCity"
                    value={cardData.billingCity}
                    onChange={(e) => handleCardDataChange("billingCity", e.target.value)}
                    placeholder="Karachi"
                  />
                </div>
                <div>
                  <Label htmlFor="billingState">State</Label>
                  <Input
                    id="billingState"
                    value={cardData.billingState}
                    onChange={(e) => handleCardDataChange("billingState", e.target.value)}
                    placeholder="Sindh"
                  />
                </div>
                <div>
                  <Label htmlFor="billingZip">ZIP Code</Label>
                  <Input
                    id="billingZip"
                    value={cardData.billingZip}
                    onChange={(e) => handleCardDataChange("billingZip", e.target.value)}
                    placeholder="75500"
                  />
                </div>
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
      {/* Background decorations */}
      <div className="absolute inset-0 grid-pattern-primary bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />

      <div className="relative flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Clinic Onboarding
            </h2>
            <p className="text-lg text-gray-600 font-medium">
              Complete your clinic profile
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              {steps.map((step) => {
                const Icon = step.icon
                const isActive = currentStep === step.number
                const isCompleted = currentStep > step.number
                
                return (
                  <div key={step.number} className="flex flex-col items-center flex-1">
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
                    <span className={`text-xs mt-2 text-center ${isActive ? "text-blue-600 font-medium" : "text-gray-500"}`}>
                      {step.title}
                    </span>
                  </div>
                )
              })}
            </div>
            <Progress value={(currentStep / 2) * 100} className="h-2" />
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
                {currentStep === 1 && "Tell us about your clinic"}
                {currentStep === 2 && "Add your payment information"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {renderStepContent()}

              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center"
                >
                  Previous
                </Button>

                {currentStep < 2 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex items-center bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Completing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Complete Setup
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

