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
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"
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

interface ProcedureItem {
  inventoryItemId: number
  inventoryItemName: string
  quantity: number
}

interface CreateProcedureModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreateProcedureModal({ isOpen, onClose, onSuccess }: CreateProcedureModalProps) {
  const [procedureName, setProcedureName] = useState("")
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [selectedItems, setSelectedItems] = useState<ProcedureItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      fetchInventoryItems()
    } else {
      // Reset form when modal closes
      setProcedureName("")
      setSelectedItems([])
    }
  }, [isOpen])

  const fetchInventoryItems = async () => {
    setIsLoading(true)
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
      setIsLoading(false)
    }
  }

  const handleAddItem = () => {
    setSelectedItems([
      ...selectedItems,
      {
        inventoryItemId: 0,
        inventoryItemName: "",
        quantity: 1,
      },
    ])
  }

  const handleRemoveItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index))
  }

  const handleItemChange = (index: number, field: keyof ProcedureItem, value: any) => {
    const updated = [...selectedItems]
    if (field === "inventoryItemId") {
      const item = inventoryItems.find((inv) => inv.id === value)
      updated[index] = {
        ...updated[index],
        inventoryItemId: value,
        inventoryItemName: item?.name || "",
      }
    } else {
      updated[index] = {
        ...updated[index],
        [field]: value,
      }
    }
    setSelectedItems(updated)
  }

  const handleCreate = async () => {
    // Validation
    if (!procedureName.trim()) {
      toast({
        title: "Validation error",
        description: "Please enter a procedure name.",
        variant: "destructive",
      })
      return
    }

    if (selectedItems.length === 0) {
      toast({
        title: "Validation error",
        description: "Please add at least one inventory item to the procedure.",
        variant: "destructive",
      })
      return
    }

    // Validate all items are selected and have valid quantities
    for (const item of selectedItems) {
      if (!item.inventoryItemId || item.inventoryItemId === 0) {
        toast({
          title: "Validation error",
          description: "Please select an inventory item for all entries.",
          variant: "destructive",
        })
        return
      }

      if (!item.quantity || item.quantity <= 0) {
        toast({
          title: "Validation error",
          description: "Please enter a valid quantity (greater than 0) for all items.",
          variant: "destructive",
        })
        return
      }
    }

    setIsCreating(true)
    try {
      const response = await fetch("/api/procedures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: procedureName.trim(),
          items: selectedItems,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast({
          title: "Procedure created",
          description: `Procedure "${procedureName}" has been created successfully.`,
        })
        onSuccess()
        onClose()
      } else {
        throw new Error(result.error || "Failed to create procedure")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create procedure. Please try again.",
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
          <DialogTitle>Create New Procedure</DialogTitle>
          <DialogDescription>
            Define a procedure by selecting inventory items and their quantities.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="procedureName">
              Procedure Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="procedureName"
              placeholder="e.g., Routine Cleaning, Tooth Filling"
              value={procedureName}
              onChange={(e) => setProcedureName(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <Label>Inventory Items <span className="text-red-500">*</span></Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddItem}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            {isLoading ? (
              <div className="text-center py-4 text-gray-500">Loading inventory items...</div>
            ) : selectedItems.length === 0 ? (
              <div className="text-center py-4 text-gray-500 border border-dashed rounded-lg px-4">
                No items added. Click "Add Item" to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {selectedItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border rounded-lg"
                  >
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Inventory Item</Label>
                        <Select
                          value={item.inventoryItemId.toString()}
                          onValueChange={(value) =>
                            handleItemChange(index, "inventoryItemId", Number.parseInt(value))
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select item" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px]">
                            {inventoryItems.map((invItem) => (
                              <SelectItem key={invItem.id} value={invItem.id.toString()}>
                                {invItem.name} ({invItem.quantity} available)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "quantity",
                              Number.parseInt(e.target.value) || 1,
                            )
                          }
                          className="w-full"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto self-start sm:self-center"
                    >
                      <X className="h-4 w-4 mr-2 sm:mr-0" />
                      <span className="sm:hidden">Remove</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedItems.length > 0 && (
            <div className="pt-2 border-t">
              <Label className="text-sm font-medium">Summary</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedItems.map((item, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {item.inventoryItemName || "Not selected"} × {item.quantity}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isCreating}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isCreating || isLoading}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            {isCreating ? "Creating..." : "Create Procedure"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

