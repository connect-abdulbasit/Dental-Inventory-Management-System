"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { InventoryTable } from "@/components/inventory/inventory-table"
import { CsvUpload } from "@/components/inventory/csv-upload"
import { Button } from "@/components/ui/button"
import { RefreshCw, Plus } from "lucide-react"

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

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchInventory = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/inventory")
      const data = await response.json()
      setItems(data)
    } catch (error) {
      console.error("Failed to fetch inventory:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  const handleRefresh = () => {
    fetchInventory()
  }

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Inventory Management" description="Manage your dental supplies and equipment" />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory Management" description="Manage your dental supplies and equipment">
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </PageHeader>

      <CsvUpload onUploadComplete={handleRefresh} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Current Inventory</h3>
          <p className="text-sm text-gray-500">
            {items.length} items • {items.filter((item) => item.status === "Low").length} low stock alerts
          </p>
        </div>

        <InventoryTable items={items} onRefresh={handleRefresh} />
      </div>
    </div>
  )
}
