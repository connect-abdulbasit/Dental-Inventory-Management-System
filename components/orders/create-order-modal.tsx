"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface InventoryItem {
  id: number
  name: string
  quantity: number
  category: string
  supplier: string
}

interface CreateOrderModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreateOrderModal({ isOpen, onClose, onSuccess }: CreateOrderModalProps) {
  const [formData, setFormData] = useState({
    productName: "",
    quantity: "",
    supplier: "",
    totalAmount: "",
    deliveryDate: "",
    trackingNumber: "",
    category: "",
  })
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [isLoadingInventory, setIsLoadingInventory] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isNewProduct, setIsNewProduct] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      fetchInventoryItems()
      // Reset form
      setFormData({
        productName: "",
        quantity: "",
        supplier: "",
        totalAmount: "",
        deliveryDate: "",
        trackingNumber: "",
        category: "",
      })
      setIsNewProduct(false)
    }
  }, [isOpen])

  const fetchInventoryItems = async () => {
    setIsLoadingInventory(true)
    try {
      const response = await fetch("/api/inventory")
      const data = await response.json()
      setInventoryItems(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load inventory items.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingInventory(false)
    }
  }

  const handleProductSelect = (value: string) => {
    if (value === "new") {
      setIsNewProduct(true)
      setFormData({ ...formData, productName: "", category: "", supplier: "" })
    } else {
      setIsNewProduct(false)
      const selectedItem = inventoryItems.find((item) => item.id === Number.parseInt(value))
      if (selectedItem) {
        setFormData({
          ...formData,
          productName: selectedItem.name,
          category: selectedItem.category,
          supplier: selectedItem.supplier,
        })
      }
    }
  }

  const handleCreate = async () => {
    // Validation
    if (!formData.productName.trim()) {
      toast({
        title: "Validation error",
        description: "Please enter a product name.",
        variant: "destructive",
      })
      return
    }

    if (!formData.quantity || Number.parseInt(formData.quantity) <= 0) {
      toast({
        title: "Validation error",
        description: "Please enter a valid quantity greater than 0.",
        variant: "destructive",
      })
      return
    }

    if (!formData.supplier.trim()) {
      toast({
        title: "Validation error",
        description: "Please enter a supplier name.",
        variant: "destructive",
      })
      return
    }

    if (!formData.deliveryDate) {
      toast({
        title: "Validation error",
        description: "Please select a delivery date.",
        variant: "destructive",
      })
      return
    }

    const amount = Number.parseFloat(formData.totalAmount)
    if (formData.totalAmount && (Number.isNaN(amount) || amount < 0)) {
      toast({
        title: "Validation error",
        description: "Please enter a valid total amount.",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: formData.productName.trim(),
          quantity: Number.parseInt(formData.quantity),
          supplier: formData.supplier.trim(),
          totalAmount: amount || 0,
          deliveryDate: formData.deliveryDate,
          trackingNumber: formData.trackingNumber.trim() || `TRK-${Date.now()}`,
          category: formData.category.trim() || "Uncategorized",
          isNewProduct: isNewProduct,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast({
          title: "Order created",
          description: result.message,
        })
        onSuccess()
        onClose()
      } else {
        throw new Error(result.error || "Failed to create order")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogDescription>
            Place a new order for inventory items. New products will be added to inventory with quantity 0 until delivered.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="product">
              Product <span className="text-red-500">*</span>
            </Label>
            {isLoadingInventory ? (
              <div className="text-sm text-gray-500">Loading products...</div>
            ) : (
              <Select
                value={
                  isNewProduct
                    ? "new"
                    : inventoryItems.find((item) => item.name === formData.productName)?.id.toString() || ""
                }
                onValueChange={handleProductSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select existing product or add new" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">
                    <div className="flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      <span>Add New Product</span>
                    </div>
                  </SelectItem>
                  {inventoryItems.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.name} ({item.quantity} in stock)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {isNewProduct && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="productName">
                  Product Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="productName"
                  placeholder="Enter product name"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., Hygiene, Safety, Materials"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
            </>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="quantity">
                Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="supplier">
                Supplier <span className="text-red-500">*</span>
              </Label>
              <Input
                id="supplier"
                placeholder="Enter supplier name"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="totalAmount">Total Amount</Label>
              <Input
                id="totalAmount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.totalAmount}
                onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deliveryDate">
                Expected Delivery Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="deliveryDate"
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="trackingNumber">Tracking Number</Label>
            <Input
              id="trackingNumber"
              placeholder="Enter tracking number (optional)"
              value={formData.trackingNumber}
              onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
            />
            <p className="text-xs text-gray-500">
              If not provided, a tracking number will be auto-generated
            </p>
          </div>

          {isNewProduct && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This product will be added to your inventory with quantity 0. The quantity will be updated automatically when the order is marked as delivered.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isCreating} className="w-full sm:w-auto order-2 sm:order-1">
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isCreating || isLoadingInventory}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            {isCreating ? "Creating..." : "Create Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

