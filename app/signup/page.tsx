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
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Users,
  Shield,
  CheckCircle,
  Star
} from "lucide-react"

interface UserData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  role: string
}

interface ClinicData {
  clinicName: string
  clinicType: string
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

interface TeamData {
  teamMembers: Array<{
    name: string
    email: string
    role: string
    phone: string
  }>
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
    role: "dentist"
  })

  const [clinicData, setClinicData] = useState<ClinicData>({
    clinicName: "",
    clinicType: "general",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: "",
    email: "",
    website: "",
    licenseNumber: "",
    establishedYear: "",
    description: ""
  })

  const [teamData, setTeamData] = useState<TeamData>({
    teamMembers: []
  })

  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Clinic Details", icon: Building2 },
    { number: 3, title: "Team Setup", icon: Users },
    { number: 4, title: "Review & Create", icon: CheckCircle }
  ]

  const handleUserDataChange = (field: keyof UserData, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }))
  }

  const handleClinicDataChange = (field: keyof ClinicData, value: string) => {
    setClinicData(prev => ({ ...prev, [field]: value }))
  }

  const addTeamMember = () => {
    setTeamData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { name: "", email: "", role: "", phone: "" }]
    }))
  }

  const updateTeamMember = (index: number, field: string, value: string) => {
    setTeamData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    }))
  }

  const removeTeamMember = (index: number) => {
    setTeamData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }))
  }

  const validateStep = (step: number): boolean => {
    setError("")
    
    switch (step) {
      case 1:
        if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
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
        return true
      
      case 2:
        if (!clinicData.clinicName || !clinicData.address || !clinicData.city || !clinicData.phone) {
          setError("Please fill in all required clinic information")
          return false
        }
        return true
      
      case 3:
        // Team setup is optional, so always valid
        return true
      
      case 4:
        if (!agreedToTerms) {
          setError("Please agree to the terms and conditions")
          return false
        }
        return true
      
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) return

    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Create user account
      const userAccount = {
        ...userData,
        clinic: clinicData,
        team: teamData,
        createdAt: new Date().toISOString()
      }

      // Store in localStorage for demo
      localStorage.setItem("cavity_user", JSON.stringify({
        id: "1",
        email: userData.email,
        name: `${userData.firstName} ${userData.lastName}`,
        role: userData.role,
        clinic: clinicData
      }))

      // Redirect to dashboard
      router.push("/dashboard")
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
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={userData.lastName}
                  onChange={(e) => handleUserDataChange("lastName", e.target.value)}
                  placeholder="Doe"
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
                placeholder="john.doe@example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={userData.phone}
                onChange={(e) => handleUserDataChange("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <Label htmlFor="role">Your Role *</Label>
              <Select value={userData.role} onValueChange={(value) => handleUserDataChange("role", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dentist">Dentist</SelectItem>
                  <SelectItem value="hygienist">Dental Hygienist</SelectItem>
                  <SelectItem value="assistant">Dental Assistant</SelectItem>
                  <SelectItem value="office_manager">Office Manager</SelectItem>
                  <SelectItem value="owner">Practice Owner</SelectItem>
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

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="clinicName">Clinic/Practice Name *</Label>
              <Input
                id="clinicName"
                value={clinicData.clinicName}
                onChange={(e) => handleClinicDataChange("clinicName", e.target.value)}
                placeholder="Bright Smile Dental Clinic"
                required
              />
            </div>

            <div>
              <Label htmlFor="clinicType">Practice Type *</Label>
              <Select value={clinicData.clinicType} onValueChange={(value) => handleClinicDataChange("clinicType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select practice type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Dentistry</SelectItem>
                  <SelectItem value="orthodontics">Orthodontics</SelectItem>
                  <SelectItem value="oral_surgery">Oral Surgery</SelectItem>
                  <SelectItem value="pediatric">Pediatric Dentistry</SelectItem>
                  <SelectItem value="cosmetic">Cosmetic Dentistry</SelectItem>
                  <SelectItem value="periodontics">Periodontics</SelectItem>
                  <SelectItem value="endodontics">Endodontics</SelectItem>
                  <SelectItem value="prosthodontics">Prosthodontics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                value={clinicData.address}
                onChange={(e) => handleClinicDataChange("address", e.target.value)}
                placeholder="123 Main Street"
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
                  placeholder="New York"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={clinicData.state}
                  onChange={(e) => handleClinicDataChange("state", e.target.value)}
                  placeholder="NY"
                  required
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  value={clinicData.zipCode}
                  onChange={(e) => handleClinicDataChange("zipCode", e.target.value)}
                  placeholder="10001"
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
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                  <SelectItem value="Germany">Germany</SelectItem>
                  <SelectItem value="France">France</SelectItem>
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
                  placeholder="+1 (555) 123-4567"
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
                  placeholder="info@brightsmile.com"
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
                  placeholder="https://www.brightsmile.com"
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
              <Label htmlFor="description">Practice Description</Label>
              <Textarea
                id="description"
                value={clinicData.description}
                onChange={(e) => handleClinicDataChange("description", e.target.value)}
                placeholder="Tell us about your practice, specialties, and what makes you unique..."
                rows={4}
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Team Members</h3>
              <p className="text-gray-600 mb-6">Add your team members to get started. You can always add more later.</p>
            </div>

            {teamData.teamMembers.map((member, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Team Member {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeTeamMember(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={member.name}
                      onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                      placeholder="Jane Smith"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={member.email}
                      onChange={(e) => updateTeamMember(index, "email", e.target.value)}
                      placeholder="jane@example.com"
                    />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Select value={member.role} onValueChange={(value) => updateTeamMember(index, "role", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dentist">Dentist</SelectItem>
                        <SelectItem value="hygienist">Dental Hygienist</SelectItem>
                        <SelectItem value="assistant">Dental Assistant</SelectItem>
                        <SelectItem value="receptionist">Receptionist</SelectItem>
                        <SelectItem value="office_manager">Office Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      type="tel"
                      value={member.phone}
                      onChange={(e) => updateTeamMember(index, "phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </Card>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addTeamMember}
              className="w-full"
            >
              + Add Team Member
            </Button>

            <div className="text-center text-sm text-gray-500">
              <p>Don't worry! You can skip this step and add team members later from your dashboard.</p>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Review Your Information</h3>
              <p className="text-gray-600">Please review your information before creating your account.</p>
            </div>

            <div className="space-y-4">
              <Card className="p-4">
                <h4 className="font-semibold mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <p className="font-medium">{userData.firstName} {userData.lastName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium">{userData.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <p className="font-medium">{userData.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Role:</span>
                    <p className="font-medium capitalize">{userData.role.replace("_", " ")}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  Clinic Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Clinic Name:</span>
                    <p className="font-medium">{clinicData.clinicName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Address:</span>
                    <p className="font-medium">
                      {clinicData.address}, {clinicData.city}, {clinicData.state} {clinicData.zipCode}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <p className="font-medium">{clinicData.phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Practice Type:</span>
                    <p className="font-medium capitalize">{clinicData.clinicType.replace("_", " ")}</p>
                  </div>
                </div>
              </Card>

              {teamData.teamMembers.length > 0 && (
                <Card className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Team Members ({teamData.teamMembers.length})
                  </h4>
                  <div className="space-y-2 text-sm">
                    {teamData.teamMembers.map((member, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="font-medium">{member.name}</span>
                        <span className="text-gray-600 capitalize">{member.role.replace("_", " ")}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                  <p className="text-xs text-muted-foreground">
                    By creating an account, you agree to our terms and conditions.
                  </p>
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">D</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Join Dentura</h2>
          <p className="mt-2 text-gray-600">Create your dental practice management account</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
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
          <Progress value={(currentStep / 4) * 100} className="h-2" />
        </div>

        <Card className="shadow-xl border-0">
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
              {currentStep === 1 && "Tell us about yourself to get started"}
              {currentStep === 2 && "Provide details about your dental practice"}
              {currentStep === 3 && "Add your team members (optional)"}
              {currentStep === 4 && "Review and create your account"}
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
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < 4 ? (
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
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Star className="w-4 h-4 mr-2" />
                      Create Account
                    </>
                  )}
                </Button>
              )}
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
  )
}
