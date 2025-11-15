"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, CreditCard, CheckCircle2, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AddPaymentMethodPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    name: "",
    zipCode: "",
  })

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "")
    const chunks = cleaned.match(/.{1,4}/g) || []
    return chunks.join(" ").slice(0, 19)
  }

  const getCardBrand = (number: string) => {
    const cleaned = number.replace(/\s/g, "")
    if (cleaned.startsWith("4")) return "Visa"
    if (cleaned.startsWith("5")) return "Mastercard"
    if (cleaned.startsWith("3")) return "Amex"
    if (cleaned.startsWith("6")) return "Discover"
    return "Card"
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validation
    if (
      !formData.cardNumber ||
      !formData.expiryMonth ||
      !formData.expiryYear ||
      !formData.cvv ||
      !formData.name
    ) {
      toast({
        title: "Validation error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const cardNumberCleaned = formData.cardNumber.replace(/\s/g, "")
    if (cardNumberCleaned.length !== 16) {
      toast({
        title: "Invalid card number",
        description: "Card number must be 16 digits.",
        variant: "destructive",
      })
      return
    }

    if (formData.cvv.length < 3 || formData.cvv.length > 4) {
      toast({
        title: "Invalid CVV",
        description: "CVV must be 3 or 4 digits.",
        variant: "destructive",
      })
      return
    }

    // Validate expiry month
    const month = Number.parseInt(formData.expiryMonth)
    if (month < 1 || month > 12) {
      toast({
        title: "Invalid expiry month",
        description: "Month must be between 01 and 12.",
        variant: "destructive",
      })
      return
    }

    // Validate expiry year (handle both 2 and 4 digit years)
    let year = Number.parseInt(formData.expiryYear)
    const currentYear = new Date().getFullYear()
    
    // If 2 digits, assume 2000s
    if (formData.expiryYear.length === 2) {
      year = 2000 + year
    }
    
    if (year < currentYear || year > currentYear + 20) {
      toast({
        title: "Invalid expiry year",
        description: "Please enter a valid expiry year.",
        variant: "destructive",
      })
      return
    }
    
    // Store as 4-digit year
    const fullYear = year.toString()

    setIsProcessing(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Save card to localStorage
      const savedCards = JSON.parse(localStorage.getItem("dentura_saved_cards") || "[]")
      const newCard = {
        id: `card-${Date.now()}`,
        last4: cardNumberCleaned.slice(-4),
        brand: getCardBrand(formData.cardNumber),
        expiryMonth: formData.expiryMonth.padStart(2, "0"),
        expiryYear: fullYear,
        name: formData.name,
      }
      savedCards.push(newCard)
      localStorage.setItem("dentura_saved_cards", JSON.stringify(savedCards))

      // Trigger storage event for other tabs/components
      window.dispatchEvent(new Event("storage"))

      setIsProcessing(false)
      setIsSuccess(true)

      // Redirect after 2 seconds
      setTimeout(() => {
        router.back()
      }, 2000)
    } catch (error) {
      setIsProcessing(false)
      toast({
        title: "Error",
        description: "Failed to save card. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Card Added Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your payment method has been saved and is ready to use.
            </p>
            <Button onClick={() => router.back()} className="w-full">
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 -ml-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Payment Method</h1>
          <p className="text-gray-600">Securely add a new credit or debit card</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      <span className="text-sm font-medium">Secure</span>
                    </div>
                    <CreditCard className="h-8 w-8" />
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-xs text-blue-200 mb-2">Card Number</div>
                    <div className="text-xl font-mono tracking-wider">
                      {formData.cardNumber || "•••• •••• •••• ••••"}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-xs text-blue-200 mb-1">Cardholder Name</div>
                      <div className="text-sm font-medium">
                        {formData.name || "YOUR NAME"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-blue-200 mb-1">Expires</div>
                      <div className="text-sm font-medium">
                        {formData.expiryMonth && formData.expiryYear
                          ? `${formData.expiryMonth}/${formData.expiryYear.slice(-2)}`
                          : "MM/YY"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-blue-200">
                      {getCardBrand(formData.cardNumber)}
                    </div>
                    <div className="text-xs text-blue-200">
                      CVV: {formData.cvv ? "•••" : "•••"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Cardholder Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Cardholder Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value.toUpperCase() })
                      }
                      className="h-12 text-base"
                      required
                    />
                  </div>

                  {/* Card Number */}
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber" className="text-sm font-medium">
                      Card Number <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="cardNumber"
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        value={formData.cardNumber}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value.replace(/\D/g, ""))
                          setFormData({ ...formData, cardNumber: formatted })
                        }}
                        className="h-12 text-base font-mono tracking-wider pl-12"
                        required
                      />
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Expiry and CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry" className="text-sm font-medium">
                        Expiry Date <span className="text-red-500">*</span>
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          id="expiryMonth"
                          type="text"
                          placeholder="MM"
                          maxLength={2}
                          value={formData.expiryMonth}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 2)
                            if (value === "" || (Number.parseInt(value) >= 1 && Number.parseInt(value) <= 12)) {
                              setFormData({ ...formData, expiryMonth: value })
                            }
                          }}
                          className="h-12 text-base text-center"
                          required
                        />
                        <Input
                          id="expiryYear"
                          type="text"
                          placeholder="YYYY"
                          maxLength={4}
                          value={formData.expiryYear}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 4)
                            setFormData({ ...formData, expiryYear: value })
                          }}
                          className="h-12 text-base text-center"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cvv" className="text-sm font-medium">
                        CVV <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="cvv"
                        type="text"
                        placeholder="123"
                        maxLength={4}
                        value={formData.cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 4)
                          setFormData({ ...formData, cvv: value })
                        }}
                        className="h-12 text-base text-center font-mono"
                        required
                      />
                    </div>
                  </div>

                  {/* Zip Code (Optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="zipCode" className="text-sm font-medium">
                      ZIP / Postal Code
                    </Label>
                    <Input
                      id="zipCode"
                      type="text"
                      placeholder="12345"
                      value={formData.zipCode}
                      onChange={(e) =>
                        setFormData({ ...formData, zipCode: e.target.value })
                      }
                      className="h-12 text-base"
                    />
                  </div>

                  {/* Security Notice */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                    <Lock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-medium mb-1">Your payment information is secure</p>
                      <p className="text-blue-700">
                        We use industry-standard encryption to protect your card details. Your full card number is never stored on our servers.
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        "Add Card"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

