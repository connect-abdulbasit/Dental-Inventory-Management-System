"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { ProceduresTable } from "@/components/procedures/procedures-table"
import { CreateProcedureModal } from "@/components/procedures/create-procedure-modal"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RefreshCw, Plus } from "lucide-react"

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

export default function ProceduresPage() {
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const fetchProcedures = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/procedures")
      const data = await response.json()
      setProcedures(data)
    } catch (error) {
      console.error("Failed to fetch procedures:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProcedures()
  }, [])

  const handleRefresh = () => {
    fetchProcedures()
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Procedures" description="Manage dental procedures and track inventory usage">
          <div className="flex items-center space-x-3">
            <Button variant="outline" disabled>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button disabled>
              <Plus className="h-4 w-4 mr-2" />
              Create Procedure
            </Button>
          </div>
        </PageHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-5 w-24" />
          </div>

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
                {Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="border-b border-gray-100">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Skeleton className="w-8 h-8 rounded-lg" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-18" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-9 w-24" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Procedures" description="Manage dental procedures and track inventory usage">
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Procedure
          </Button>
        </div>
      </PageHeader>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">All Procedures</h3>
          <p className="text-sm text-gray-500">
            {procedures.length} procedure{procedures.length !== 1 ? "s" : ""}
          </p>
        </div>

        <ProceduresTable procedures={procedures} onRefresh={handleRefresh} />
      </div>

      <CreateProcedureModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleRefresh}
      />
    </div>
  )
}

