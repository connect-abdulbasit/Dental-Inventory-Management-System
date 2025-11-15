"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Edit, Package, Minus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"

interface InventoryItem {
  id: number
  name: string
  quantity: number
  threshold: number
  status: string
  category: string
  supplier: string
  lastUpdated: string
  orderAmount?: number
}

interface InventoryTableProps {
  items: InventoryItem[]
  onRefresh: () => void
}

export function InventoryTable({ items, onRefresh }: InventoryTableProps) {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [newQuantity, setNewQuantity] = useState("")
  const [newThreshold, setNewThreshold] = useState("")
  const [newOrderAmount, setNewOrderAmount] = useState("")
  const [deductQuantity, setDeductQuantity] = useState("")
  const [deductReason, setDeductReason] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeducting, setIsDeducting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeductDialogOpen, setIsDeductDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleUpdateQuantity = async () => {
    if (!selectedItem || !newQuantity || !newThreshold || !newOrderAmount) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const qty = Number.parseInt(newQuantity)
    const threshold = Number.parseInt(newThreshold)
    const orderAmount = Number.parseInt(newOrderAmount)

    if (Number.isNaN(qty) || Number.isNaN(threshold) || Number.isNaN(orderAmount)) {
      toast({
        title: "Invalid Input",
        description: "All fields must be valid numbers",
        variant: "destructive",
      })
      return
    }

    if (qty < 0 || threshold < 0 || orderAmount < 0) {
      toast({
        title: "Invalid Input",
        description: "All values must be non-negative",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)
    try {
      const response = await fetch("/api/inventory/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedItem.id,
          newQuantity: qty,
          newThreshold: threshold,
          newOrderAmount: orderAmount,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        setIsDialogOpen(false)
        setSelectedItem(null)
        setNewQuantity("")
        setNewThreshold("")
        setNewOrderAmount("")
        onRefresh()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update inventory",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const openUpdateDialog = (item: InventoryItem) => {
    setSelectedItem(item)
    setNewQuantity(item.quantity.toString())
    setNewThreshold(item.threshold.toString())
    setNewOrderAmount((item.orderAmount || 0).toString())
    setIsDialogOpen(true)
  }

  const openDeductDialog = (item: InventoryItem) => {
    setSelectedItem(item)
    setDeductQuantity("")
    setDeductReason("")
    setIsDeductDialogOpen(true)
  }

  const handleDeductQuantity = async () => {
    if (!selectedItem || !deductQuantity) return

    const deductQty = Number.parseInt(deductQuantity)
    if (Number.isNaN(deductQty) || deductQty <= 0) {
      toast({
        title: "Invalid quantity",
        description: "Please enter a valid positive number",
        variant: "destructive",
      })
      return
    }

    if (selectedItem.quantity < deductQty) {
      toast({
        title: "Insufficient quantity",
        description: `Available: ${selectedItem.quantity}, Requested: ${deductQty}`,
        variant: "destructive",
      })
      return
    }

    setIsDeducting(true)
    try {
      const response = await fetch("/api/inventory/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedItem.id,
          deductQuantity: deductQty,
          reason: deductReason || undefined,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        setIsDeductDialogOpen(false)
        setSelectedItem(null)
        setDeductQuantity("")
        setDeductReason("")
        onRefresh()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to deduct quantity",
        variant: "destructive",
      })
    } finally {
      setIsDeducting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    if (status === "Low") {
      return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100">Low Stock</Badge>
    } else if (status === "Out") {
      return <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100">Out of Stock</Badge>
    } else {
      return <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">In Stock</Badge>
    }
  }

  return (
    <>
      <div className="rounded-lg border-0 shadow-sm bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-b border-gray-200">
              <TableHead className="font-semibold text-gray-700">Product Name</TableHead>
              <TableHead className="font-semibold text-gray-700">Category</TableHead>
              <TableHead className="font-semibold text-gray-700">Quantity</TableHead>
              <TableHead className="font-semibold text-gray-700">Threshold</TableHead>
              <TableHead className="font-semibold text-gray-700">Order Amount</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
              <TableHead className="font-semibold text-gray-700">Supplier</TableHead>
              <TableHead className="font-semibold text-gray-700">Last Updated</TableHead>
              <TableHead className="font-semibold text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-100">
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Package className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-gray-900">{item.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{item.category}</TableCell>
                <TableCell className="text-gray-900 font-semibold">{item.quantity}</TableCell>
                <TableCell className="text-gray-600">{item.threshold}</TableCell>
                <TableCell className="text-gray-600">{item.orderAmount || 0}</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell className="text-gray-600">{item.supplier}</TableCell>
                <TableCell className="text-gray-500 text-sm">{item.lastUpdated}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openDeductDialog(item)}
                      className="hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors"
                    >
                      <Minus className="h-4 w-4 mr-1" />
                      Deduct
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openUpdateDialog(item)}
                      className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Update
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Update Inventory</DialogTitle>
            <DialogDescription className="text-sm">
              Update inventory details for {selectedItem?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
              <Label htmlFor="quantity" className="text-sm sm:text-right pt-2 sm:pt-0">
                Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                className="col-span-1 sm:col-span-3"
                min="0"
                placeholder="Current quantity"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
              <Label htmlFor="threshold" className="text-sm sm:text-right pt-2 sm:pt-0">
                Threshold <span className="text-red-500">*</span>
              </Label>
              <Input
                id="threshold"
                type="number"
                value={newThreshold}
                onChange={(e) => setNewThreshold(e.target.value)}
                className="col-span-1 sm:col-span-3"
                min="0"
                placeholder="Reorder threshold"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
              <Label htmlFor="orderAmount" className="text-sm sm:text-right pt-2 sm:pt-0">
                Order Amount <span className="text-red-500">*</span>
              </Label>
              <Input
                id="orderAmount"
                type="number"
                value={newOrderAmount}
                onChange={(e) => setNewOrderAmount(e.target.value)}
                className="col-span-1 sm:col-span-3"
                min="0"
                placeholder="Quantity to order"
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-900 font-medium mb-1">Current Values:</p>
              <div className="text-xs text-blue-700 space-y-1">
                <p>Quantity: <span className="font-semibold">{selectedItem?.quantity}</span></p>
                <p>Threshold: <span className="font-semibold">{selectedItem?.threshold}</span></p>
                <p>Order Amount: <span className="font-semibold">{selectedItem?.orderAmount || 0}</span></p>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateQuantity} 
              disabled={isUpdating}
              className="w-full sm:w-auto"
            >
              {isUpdating ? "Updating..." : "Update Inventory"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deduct Quantity Dialog */}
      <Dialog open={isDeductDialogOpen} onOpenChange={setIsDeductDialogOpen}>
        <DialogContent className="max-w-md w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Deduct Quantity</DialogTitle>
            <DialogDescription className="text-sm">
              Deduct quantity from {selectedItem?.name} (Current: {selectedItem?.quantity})
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
              <Label htmlFor="deductQuantity" className="text-sm sm:text-right pt-2 sm:pt-0">
                Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="deductQuantity"
                type="number"
                value={deductQuantity}
                onChange={(e) => setDeductQuantity(e.target.value)}
                className="col-span-1 sm:col-span-3"
                min="1"
                max={selectedItem?.quantity}
                placeholder="Enter quantity to deduct"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4">
              <Label htmlFor="deductReason" className="text-sm sm:text-right pt-2">
                Reason
              </Label>
              <Textarea
                id="deductReason"
                value={deductReason}
                onChange={(e) => setDeductReason(e.target.value)}
                className="col-span-1 sm:col-span-3"
                placeholder="Optional: Enter reason for deduction (e.g., Used for procedure, Damaged, etc.)"
                rows={3}
              />
            </div>
            {deductQuantity && selectedItem && Number.parseInt(deductQuantity) > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-900">
                  <span className="font-medium">New quantity will be:</span>{" "}
                  {selectedItem.quantity - Number.parseInt(deductQuantity)} units
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setIsDeductDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeductQuantity} 
              disabled={isDeducting || !deductQuantity || Number.parseInt(deductQuantity) <= 0}
              className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
            >
              {isDeducting ? "Deducting..." : "Deduct Quantity"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
