"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { InventoryTable } from "@/components/inventory/inventory-table"
import { CsvUpload } from "@/components/inventory/csv-upload"
import { ProductCatalog } from "@/components/inventory/product-catalog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, Plus, Package, List } from "lucide-react"

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
      <div className="space-y-6">
        <PageHeader title="Inventory Management" description="Manage your dental supplies and equipment">
          <div className="flex items-center space-x-3">
            <Button variant="outline" disabled>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </PageHeader>

        <Tabs defaultValue="catalog" className="space-y-4">
          <TabsList>
            <TabsTrigger value="catalog" disabled>
              <Package className="h-4 w-4" />
              <span>Product Catalog</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" disabled>
              <List className="h-4 w-4" />
              <span>Current Inventory</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="catalog" className="space-y-4">
            {/* Product Catalog Skeleton */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      <Skeleton className="h-6 w-40" />
                    </CardTitle>
                    <CardDescription>
                      <Skeleton className="h-4 w-64 mt-2" />
                    </CardDescription>
                  </div>
                  <Skeleton className="h-10 w-32" />
                </div>
                <div className="mt-4">
                  <Skeleton className="h-10 w-full max-w-md" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <Skeleton className="h-48 w-full mb-4 rounded-lg" />
                        <Skeleton className="h-5 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-2/3 mb-4" />
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-9 w-24" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            {/* CSV Upload Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>

            {/* Inventory Table Skeleton */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-5 w-48" />
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
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
                    {Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-5 w-32" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-24" />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Skeleton className="h-9 w-9" />
                            <Skeleton className="h-9 w-9" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
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
        </div>
      </PageHeader>

      <Tabs defaultValue="catalog" className="space-y-4">
        <TabsList>
          <TabsTrigger value="catalog" className="flex items-center space-x-2">
            <Package className="h-4 w-4" />
            <span>Product Catalog</span>
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center space-x-2">
            <List className="h-4 w-4" />
            <span>Current Inventory</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="space-y-4">
          <ProductCatalog onProductAdded={handleRefresh} />
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
