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
    return status === "Low" ? <Badge variant="destructive">Low Stock</Badge> : <Badge variant="secondary">OK</Badge>
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Threshold</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span>{item.name}</span>
                  </div>
                </TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.threshold}</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell>{item.supplier}</TableCell>
                <TableCell>{item.lastUpdated}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => openUpdateDialog(item)}>
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
