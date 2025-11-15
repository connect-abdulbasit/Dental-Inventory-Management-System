"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { 
  Store, 
  MapPin, 
  Phone, 
  Mail,
  CheckCircle
} from "lucide-react"

interface SupplierData {
  storeName: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
  email: string
  website: string
  description: string
}

export default function SupplierOnboardingPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [supplierData, setSupplierData] = useState<SupplierData>({
    storeName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Pakistan",
    phone: "",
    email: "",
    website: "",
    description: ""
  })

  const handleSupplierDataChange = (field: keyof SupplierData, value: string) => {
    setSupplierData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = (): boolean => {
    setError("")
    
    if (!supplierData.storeName || !supplierData.address || !supplierData.city || !supplierData.phone) {
      setError("Please fill in all required fields")
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    setError("")

    try {
      // Save supplier onboarding data
      const response = await fetch("/api/signup/supplier-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplier: supplierData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to complete onboarding. Please try again.")
        return
      }

      // Clear pending signup data
      sessionStorage.removeItem("pending_signup")

      // Login the user and redirect to dashboard
      // In production, you would set up the session here
      router.push("/dashboard")
    } catch (err) {
      setError("Failed to complete onboarding. Please try again.")
    } finally {
      setIsLoading(false)
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
              <Store className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Supplier Onboarding
            </h2>
            <p className="text-lg text-gray-600 font-medium">
              Complete your supplier profile
            </p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Store className="w-5 h-5 mr-2 text-blue-600" />
                Supplier Information
              </CardTitle>
              <CardDescription>
                Tell us about your supplier business
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-6">
                <div>
                  <Label htmlFor="storeName">Store/Company Name *</Label>
                  <Input
                    id="storeName"
                    value={supplierData.storeName}
                    onChange={(e) => handleSupplierDataChange("storeName", e.target.value)}
                    placeholder="Pak Dental Supplies"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    value={supplierData.address}
                    onChange={(e) => handleSupplierDataChange("address", e.target.value)}
                    placeholder="123 Main Boulevard, Block B"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={supplierData.city}
                      onChange={(e) => handleSupplierDataChange("city", e.target.value)}
                      placeholder="Lahore"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={supplierData.state}
                      onChange={(e) => handleSupplierDataChange("state", e.target.value)}
                      placeholder="Punjab"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={supplierData.zipCode}
                      onChange={(e) => handleSupplierDataChange("zipCode", e.target.value)}
                      placeholder="54000"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={supplierData.country}
                    onChange={(e) => handleSupplierDataChange("country", e.target.value)}
                    placeholder="Pakistan"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={supplierData.phone}
                      onChange={(e) => handleSupplierDataChange("phone", e.target.value)}
                      placeholder="+92 300 1234567"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={supplierData.email}
                      onChange={(e) => handleSupplierDataChange("email", e.target.value)}
                      placeholder="info@paksupplies.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={supplierData.website}
                    onChange={(e) => handleSupplierDataChange("website", e.target.value)}
                    placeholder="https://www.paksupplies.com"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea
                    id="description"
                    value={supplierData.description}
                    onChange={(e) => handleSupplierDataChange("description", e.target.value)}
                    placeholder="Tell us about your business, products, and services..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-8">
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

