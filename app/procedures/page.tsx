"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { ProceduresTable } from "@/components/procedures/procedures-table"
import { CreateProcedureModal } from "@/components/procedures/create-procedure-modal"
import { Button } from "@/components/ui/button"
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
      <div>
        <PageHeader title="Procedures" description="Manage dental procedures and track inventory usage" />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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

