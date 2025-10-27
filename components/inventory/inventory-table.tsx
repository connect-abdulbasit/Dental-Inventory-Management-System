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
import { Edit, Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface InventoryItem {
  id: number
  name: string
  quantity: number
  threshold: number
  status: string
  category: string
  supplier: string
  lastUpdated: string
}

interface InventoryTableProps {
  items: InventoryItem[]
  onRefresh: () => void
}

export function InventoryTable({ items, onRefresh }: InventoryTableProps) {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [newQuantity, setNewQuantity] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleUpdateQuantity = async () => {
    if (!selectedItem || !newQuantity) return

    setIsUpdating(true)
    try {
      const response = await fetch("/api/inventory/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedItem.id,
          newQuantity: Number.parseInt(newQuantity),
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
        onRefresh()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const openUpdateDialog = (item: InventoryItem) => {
    setSelectedItem(item)
    setNewQuantity(item.quantity.toString())
    setIsDialogOpen(true)
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
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell className="text-gray-600">{item.supplier}</TableCell>
                <TableCell className="text-gray-500 text-sm">{item.lastUpdated}</TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => openUpdateDialog(item)}
                    className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Quantity</DialogTitle>
            <DialogDescription>Update the quantity for {selectedItem?.name}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                className="col-span-3"
                min="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateQuantity} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Quantity"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
