"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Plus, Trash2, Loader2, CheckCircle2, Package } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"

interface SavedCard {
  id: string
  last4: string
  brand: string
  expiryMonth: string
  expiryYear: string
  name: string
}

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CheckoutModal({ isOpen, onClose, onSuccess }: CheckoutModalProps) {
  const router = useRouter()
  const { cartItems, clearCart, getCartItemCount } = useCart()
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [savedCards, setSavedCards] = useState<SavedCard[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      // Load saved cards from localStorage
      const saved = localStorage.getItem("dentura_saved_cards")
      if (saved) {
        try {
          setSavedCards(JSON.parse(saved))
        } catch (error) {
          console.error("Failed to load saved cards", error)
        }
      }
    }
  }, [isOpen])

  // Reload cards when modal opens (in case user added a new card)
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("dentura_saved_cards")
      if (saved) {
        try {
          setSavedCards(JSON.parse(saved))
        } catch (error) {
          console.error("Failed to load saved cards", error)
        }
      }
    }

    // Check for updates periodically when modal is open
    const interval = setInterval(() => {
      if (isOpen) {
        handleStorageChange()
      }
    }, 500)

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("focus", handleStorageChange)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("focus", handleStorageChange)
    }
  }, [isOpen])


  const handleRemoveCard = (cardId: string) => {
    const updated = savedCards.filter((card) => card.id !== cardId)
    setSavedCards(updated)
    localStorage.setItem("dentura_saved_cards", JSON.stringify(updated))

    if (paymentMethod === cardId) {
      setPaymentMethod("cod")
    }

    toast({
      title: "Card removed",
      description: "Card has been removed from your saved cards.",
    })
  }

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      })
      return
    }

    // Validate payment method
    if (paymentMethod === "card") {
      // If "card" is selected but no specific card is chosen, check if there are saved cards
      if (savedCards.length === 0) {
        toast({
          title: "Payment method required",
          description: "Please add a card to proceed with card payment.",
          variant: "destructive",
        })
        return
      }
      // If "card" is selected but no specific saved card is selected, require selection
      if (savedCards.length > 0 && !savedCards.some((card) => card.id === paymentMethod)) {
        toast({
          title: "Card selection required",
          description: "Please select a saved card to proceed.",
          variant: "destructive",
        })
        return
      }
    }

    setIsProcessing(true)
    
    // Add a minimum delay for better UX (show loading animation)
    const minDelay = new Promise((resolve) => setTimeout(resolve, 2000))
    
    try {
      // Create orders for each cart item
      const orderPromises = cartItems.map((item) => {
        // Find supplier from inventory or use default
        const supplier = item.supplier || "Unknown Supplier"
        const category = item.category || "Uncategorized"

        return fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product: item.productName,
            quantity: item.quantity,
            supplier: supplier,
            totalAmount: 0, // Can be calculated if unit prices are available
            deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days from now
            trackingNumber: `TRK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            category: category,
            isNewProduct: true, // Always add to inventory if not exists
            paymentMethod: paymentMethod,
          }),
        })
      })

      // Wait for both the API calls and minimum delay
      const [results] = await Promise.all([Promise.all(orderPromises), minDelay])
      const allSuccessful = results.every((res) => res.ok)

      if (allSuccessful) {
        // Show success state briefly before closing
        await new Promise((resolve) => setTimeout(resolve, 1500))
        
        toast({
          title: "Order placed successfully",
          description: `${cartItems.length} order(s) have been created.`,
        })
        clearCart()
        onSuccess()
        onClose()
      } else {
        throw new Error("Some orders failed to process")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process checkout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        {/* Loading Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-white/98 backdrop-blur-md z-50 flex items-center justify-center rounded-lg">
            <div className="text-center space-y-8 p-10 max-w-md">
              {/* Animated Circle with Gradient */}
              <div className="relative w-32 h-32 mx-auto">
                {/* Outer pulsing ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 opacity-20 animate-ping"></div>
                {/* Middle pulsing ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 opacity-30 animate-pulse"></div>
                {/* Spinning border */}
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-purple-600 animate-spin"></div>
                {/* Inner circle with icon */}
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center shadow-lg">
                  <div className="relative">
                    <Package className="h-10 w-10 text-blue-600 animate-bounce" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-white"></div>
                  </div>
                </div>
              </div>

              {/* Processing Text */}
              <div className="space-y-3">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Processing
                </h3>
                <p className="text-lg text-gray-600 font-medium">Please wait while we place your order...</p>
              </div>

              {/* Animated Progress Steps */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-center gap-3 text-sm">
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse"></div>
                    <div className="absolute inset-0 w-3 h-3 rounded-full bg-blue-600 animate-ping opacity-75"></div>
                  </div>
                  <span className="font-medium text-gray-700">Validating payment method</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-sm">
                  <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: "200ms" }}></div>
                  <span className="text-gray-500">Creating order items</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-sm">
                  <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: "400ms" }}></div>
                  <span className="text-gray-500">Confirming details</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="pt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-full animate-[progress_2s_ease-in-out_infinite] bg-[length:200%_100%]"></div>
                </div>
              </div>

              {/* Loading Dots */}
              <div className="flex items-center justify-center gap-2 pt-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        )}

        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>Review your order and select payment method</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    {item.supplier && (
                      <Badge variant="outline">{item.supplier}</Badge>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Items:</span>
                  <span className="font-semibold">{getCartItemCount()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Method</CardTitle>
              <CardDescription>Select how you would like to pay</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-4">
                  {/* Cash on Delivery */}
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Cash on Delivery (COD)</p>
                          <p className="text-sm text-gray-500">Pay when you receive the order</p>
                        </div>
                      </div>
                    </Label>
                  </div>

                    {/* Card Payment */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Credit/Debit Card</p>
                            <p className="text-sm text-gray-500">
                              {savedCards.length > 0
                                ? `Select from ${savedCards.length} saved card(s) or add new`
                                : "Pay with card"}
                            </p>
                          </div>
                          <CreditCard className="h-5 w-5 text-gray-400" />
                        </div>
                      </Label>
                    </div>

                    {(paymentMethod === "card" || savedCards.some(card => card.id === paymentMethod)) && (
                      <div className="ml-8 space-y-3">
                        {/* Saved Cards */}
                        {savedCards.length > 0 && (
                          <div className="space-y-3">
                            {savedCards.map((card) => (
                              <div
                                key={card.id}
                                className={`flex items-center space-x-3 p-4 border rounded-lg transition-colors ${
                                  paymentMethod === card.id
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                              >
                                <RadioGroupItem value={card.id} id={card.id} />
                                <Label htmlFor={card.id} className="flex-1 cursor-pointer">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="flex items-center space-x-2 mb-1">
                                        <CreditCard className="h-4 w-4 text-gray-600" />
                                        <span className="font-medium text-gray-900">
                                          {card.brand} •••• {card.last4}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                          {card.expiryMonth.padStart(2, "0")}/{card.expiryYear.slice(-2)}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-500">{card.name}</p>
                                    </div>
                                  </div>
                                </Label>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemoveCard(card.id)
                                  }}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add New Card */}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            router.push("/payment-methods/add")
                          }}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add New Card
                        </Button>

                        {paymentMethod === "card" && savedCards.length === 0 && (
                          <div className="ml-8 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                              Please add a card to proceed with card payment
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isProcessing} className="w-full sm:w-auto order-2 sm:order-1">
            Cancel
          </Button>
          <Button
            onClick={handleCheckout}
            disabled={
              isProcessing ||
              (paymentMethod === "card" && savedCards.length === 0) ||
              (paymentMethod === "card" &&
                savedCards.length > 0 &&
                !savedCards.some((card) => card.id === paymentMethod))
            }
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            {isProcessing ? "Processing..." : "Place Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

