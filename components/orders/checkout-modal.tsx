"use client"

import { useState, useEffect } from "react"
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
import { CreditCard, Plus, Trash2 } from "lucide-react"
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
  const { cartItems, clearCart, getCartItemCount } = useCart()
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [savedCards, setSavedCards] = useState<SavedCard[]>([])
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [newCard, setNewCard] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    name: "",
  })
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

  const handleAddCard = () => {
    // Validate card details
    if (
      !newCard.cardNumber ||
      !newCard.expiryMonth ||
      !newCard.expiryYear ||
      !newCard.cvv ||
      !newCard.name
    ) {
      toast({
        title: "Validation error",
        description: "Please fill in all card details.",
        variant: "destructive",
      })
      return
    }

    if (newCard.cardNumber.replace(/\s/g, "").length !== 16) {
      toast({
        title: "Invalid card number",
        description: "Card number must be 16 digits.",
        variant: "destructive",
      })
      return
    }

    // Create saved card
    const card: SavedCard = {
      id: `card-${Date.now()}`,
      last4: newCard.cardNumber.slice(-4),
      brand: "Visa", // In real app, detect from card number
      expiryMonth: newCard.expiryMonth,
      expiryYear: newCard.expiryYear,
      name: newCard.name,
    }

    const updated = [...savedCards, card]
    setSavedCards(updated)
    localStorage.setItem("dentura_saved_cards", JSON.stringify(updated))

    // Reset form
    setNewCard({
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      name: "",
    })
    setIsAddingCard(false)
    setPaymentMethod(card.id)

    toast({
      title: "Card saved",
      description: "Your card has been saved successfully.",
    })
  }

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
      if (savedCards.length === 0 && !isAddingCard) {
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

      const results = await Promise.all(orderPromises)
      const allSuccessful = results.every((res) => res.ok)

      if (allSuccessful) {
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

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "")
    const match = cleaned.match(/.{1,4}/g)
    return match ? match.join(" ") : cleaned
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
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

                    {paymentMethod === "card" && (
                      <div className="ml-8 space-y-4">
                        {/* Saved Cards */}
                        {savedCards.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Saved Cards</Label>
                            {savedCards.map((card) => (
                              <div
                                key={card.id}
                                className={`flex items-center justify-between p-3 border rounded-lg ${
                                  paymentMethod === card.id ? "border-blue-500 bg-blue-50" : ""
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <RadioGroupItem value={card.id} id={card.id} />
                                  <Label htmlFor={card.id} className="cursor-pointer">
                                    <div className="flex items-center space-x-2">
                                      <CreditCard className="h-4 w-4" />
                                      <span className="font-medium">
                                        {card.brand} •••• {card.last4}
                                      </span>
                                      <span className="text-sm text-gray-500">
                                        {card.expiryMonth}/{card.expiryYear}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-500">{card.name}</p>
                                  </Label>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveCard(card.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add New Card */}
                        {!isAddingCard ? (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsAddingCard(true)}
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Card
                          </Button>
                        ) : (
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">Add New Card</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid gap-2">
                                <Label htmlFor="cardName">Cardholder Name</Label>
                                <Input
                                  id="cardName"
                                  placeholder="John Doe"
                                  value={newCard.name}
                                  onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="cardNumber">Card Number</Label>
                                <Input
                                  id="cardNumber"
                                  placeholder="1234 5678 9012 3456"
                                  maxLength={19}
                                  value={newCard.cardNumber}
                                  onChange={(e) => {
                                    const formatted = formatCardNumber(e.target.value.replace(/\D/g, ""))
                                    setNewCard({ ...newCard, cardNumber: formatted })
                                  }}
                                />
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="expiryMonth">Month</Label>
                                  <Input
                                    id="expiryMonth"
                                    placeholder="MM"
                                    maxLength={2}
                                    value={newCard.expiryMonth}
                                    onChange={(e) =>
                                      setNewCard({
                                        ...newCard,
                                        expiryMonth: e.target.value.replace(/\D/g, "").slice(0, 2),
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="expiryYear">Year</Label>
                                  <Input
                                    id="expiryYear"
                                    placeholder="YY"
                                    maxLength={2}
                                    value={newCard.expiryYear}
                                    onChange={(e) =>
                                      setNewCard({
                                        ...newCard,
                                        expiryYear: e.target.value.replace(/\D/g, "").slice(0, 2),
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="cvv">CVV</Label>
                                  <Input
                                    id="cvv"
                                    placeholder="123"
                                    maxLength={4}
                                    type="password"
                                    value={newCard.cvv}
                                    onChange={(e) =>
                                      setNewCard({
                                        ...newCard,
                                        cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                                      })
                                    }
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    setIsAddingCard(false)
                                    setNewCard({
                                      cardNumber: "",
                                      expiryMonth: "",
                                      expiryYear: "",
                                      cvv: "",
                                      name: "",
                                    })
                                  }}
                                  className="flex-1"
                                >
                                  Cancel
                                </Button>
                                <Button type="button" onClick={handleAddCard} className="flex-1">
                                  Save Card
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {paymentMethod === "card" && savedCards.length === 0 && !isAddingCard && (
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
              (paymentMethod === "card" &&
                savedCards.length === 0 &&
                !isAddingCard) ||
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

