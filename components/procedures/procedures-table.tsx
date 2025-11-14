"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle2, Package, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProcedureItem {
  inventoryItemId: number
  inventoryItemName: string
  quantity: number
}

interface Procedure {
  id: number
  name: string
  items: ProcedureItem[]
  createdAt: string
  updatedAt: string
}

interface ProceduresTableProps {
  procedures: Procedure[]
  onRefresh: () => void
}

export function ProceduresTable({ procedures, onRefresh }: ProceduresTableProps) {
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null)
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const { toast } = useToast()

  const handleCompleteProcedure = async () => {
    if (!selectedProcedure) return

    setIsCompleting(true)
    try {
      const response = await fetch("/api/procedures/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          procedureId: selectedProcedure.id,
          items: selectedProcedure.items,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast({
          title: "Procedure completed",
          description: `${selectedProcedure.name} has been completed. Inventory items have been deducted.`,
        })
        setIsCompleteDialogOpen(false)
        setSelectedProcedure(null)
        onRefresh()
      } else {
        if (result.insufficientItems) {
          const itemsList = result.insufficientItems
            .map((item: any) => `${item.name} (Available: ${item.available}, Required: ${item.required})`)
            .join(", ")
          toast({
            title: "Insufficient inventory",
            description: `Cannot complete procedure. ${itemsList}`,
            variant: "destructive",
          })
        } else {
          throw new Error(result.error || "Failed to complete procedure")
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete procedure. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCompleting(false)
    }
  }

  const openCompleteDialog = (procedure: Procedure) => {
    setSelectedProcedure(procedure)
    setIsCompleteDialogOpen(true)
  }

  return (
    <>
      <div className="rounded-lg border-0 shadow-sm bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-b border-gray-200">
              <TableHead className="font-semibold text-gray-700">Procedure Name</TableHead>
              <TableHead className="font-semibold text-gray-700">Items Required</TableHead>
              <TableHead className="font-semibold text-gray-700">Total Items</TableHead>
              <TableHead className="font-semibold text-gray-700">Created</TableHead>
              <TableHead className="font-semibold text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {procedures.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No procedures found. Create your first procedure to get started.
                </TableCell>
              </TableRow>
            ) : (
              procedures.map((procedure) => (
                <TableRow key={procedure.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-100">
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Package className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-gray-900">{procedure.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {procedure.items.slice(0, 3).map((item, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {item.inventoryItemName} ({item.quantity})
                        </Badge>
                      ))}
                      {procedure.items.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{procedure.items.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-900 font-semibold">
                    {procedure.items.length} items
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {new Date(procedure.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => openCompleteDialog(procedure)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Complete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Procedure: {selectedProcedure?.name}</DialogTitle>
            <DialogDescription>
              This will deduct the following items from your inventory:
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              {selectedProcedure?.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">{item.inventoryItemName}</span>
                  <Badge variant="outline">{item.quantity} units</Badge>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCompleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCompleteProcedure}
              disabled={isCompleting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isCompleting ? "Completing..." : "Complete Procedure"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

