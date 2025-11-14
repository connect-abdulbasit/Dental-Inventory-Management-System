"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { Package, Plus, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Product {
  id: string
  name: string
  description: string
  category: string
  supplier: string
  unit: string
}

interface ProductCatalogProps {
  onProductAdded: () => void
}

const availableProducts: Product[] = [
  {
    id: "1",
    name: "Dental Floss",
    description: "High-quality dental floss for daily oral hygiene",
    category: "Hygiene",
    supplier: "DentalCorp",
    unit: "Pack of 50",
  },
  {
    id: "2",
    name: "Disposable Gloves",
    description: "Latex-free disposable gloves for dental procedures",
    category: "Safety",
    supplier: "MedSupply Inc",
    unit: "Box of 100",
  },
  {
    id: "3",
    name: "Anesthetic Cartridges",
    description: "Local anesthetic cartridges for dental procedures",
    category: "Medication",
    supplier: "PharmaDental",
    unit: "Box of 50",
  },
  {
    id: "4",
    name: "Composite Filling Material",
    description: "High-quality composite resin for dental fillings",
    category: "Materials",
    supplier: "DentalCorp",
    unit: "Kit",
  },
  {
    id: "5",
    name: "X-Ray Films",
    description: "Digital X-ray films for dental imaging",
    category: "Imaging",
    supplier: "RadiologyPlus",
    unit: "Pack of 100",
  },
  {
    id: "6",
    name: "Dental Mirrors",
    description: "Sterilizable dental mirrors for examination",
    category: "Instruments",
    supplier: "InstrumentCo",
    unit: "Set of 12",
  },
  {
    id: "7",
    name: "Suction Tips",
    description: "Disposable suction tips for dental procedures",
    category: "Disposables",
    supplier: "DentalCorp",
    unit: "Pack of 200",
  },
  {
    id: "8",
    name: "Fluoride Gel",
    description: "Professional fluoride gel for dental treatments",
    category: "Treatment",
    supplier: "PharmaDental",
    unit: "12 tubes",
  },
  {
    id: "9",
    name: "Dental Bibs",
    description: "Disposable dental bibs for patient protection",
    category: "Disposables",
    supplier: "MedSupply Inc",
    unit: "Pack of 500",
  },
  {
    id: "10",
    name: "Prophy Paste",
    description: "Polishing paste for dental cleanings",
    category: "Treatment",
    supplier: "DentalCorp",
    unit: "Jar",
  },
  {
    id: "11",
    name: "Cotton Rolls",
    description: "Sterile cotton rolls for dental procedures",
    category: "Disposables",
    supplier: "MedSupply Inc",
    unit: "Box of 1000",
  },
  {
    id: "12",
    name: "Dental Syringes",
    description: "Disposable dental syringes for injections",
    category: "Instruments",
    supplier: "InstrumentCo",
    unit: "Box of 50",
  },
]

const ITEMS_PER_PAGE = 12

export function ProductCatalog({ onProductAdded }: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    currentQuantity: "",
    threshold: "",
    orderAmount: "",
  })
  const [isAdding, setIsAdding] = useState(false)
  const { toast } = useToast()

  const filteredProducts = useMemo(
    () =>
      availableProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.supplier.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [searchQuery],
  )

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push("ellipsis-start")
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis-end")
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product)
    setFormData({
      currentQuantity: "",
      threshold: "",
      orderAmount: "",
    })
    setIsDialogOpen(true)
  }

  const handleAddToInventory = async () => {
    if (!selectedProduct) return

    const currentQty = Number.parseInt(formData.currentQuantity)
    const threshold = Number.parseInt(formData.threshold)
    const orderAmount = Number.parseInt(formData.orderAmount)

    if (
      Number.isNaN(currentQty) ||
      Number.isNaN(threshold) ||
      Number.isNaN(orderAmount) ||
      currentQty < 0 ||
      threshold < 0 ||
      orderAmount < 0
    ) {
      toast({
        title: "Invalid input",
        description: "Please enter valid positive numbers for all fields.",
        variant: "destructive",
      })
      return
    }

    setIsAdding(true)
    try {
      const response = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedProduct.name,
          quantity: currentQty,
          threshold: threshold,
          orderAmount: orderAmount,
          category: selectedProduct.category,
          supplier: selectedProduct.supplier,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast({
          title: "Product added",
          description: `${selectedProduct.name} has been added to your inventory.`,
        })
        setIsDialogOpen(false)
        setSelectedProduct(null)
        setFormData({
          currentQuantity: "",
          threshold: "",
          orderAmount: "",
        })
        onProductAdded()
      } else {
        throw new Error(result.error || "Failed to add product")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to inventory. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Hygiene: "bg-blue-100 text-blue-700 border-blue-200",
      Safety: "bg-red-100 text-red-700 border-red-200",
      Medication: "bg-purple-100 text-purple-700 border-purple-200",
      Materials: "bg-green-100 text-green-700 border-green-200",
      Imaging: "bg-yellow-100 text-yellow-700 border-yellow-200",
      Instruments: "bg-indigo-100 text-indigo-700 border-indigo-200",
      Disposables: "bg-gray-100 text-gray-700 border-gray-200",
      Treatment: "bg-pink-100 text-pink-700 border-pink-200",
    }
    return colors[category] || "bg-gray-100 text-gray-700 border-gray-200"
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Product Catalog</span>
          </CardTitle>
          <CardDescription>
            Browse and add products from our catalog to your inventory
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products by name, category, or supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of{" "}
                {filteredProducts.length} products
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{product.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge className={getCategoryColor(product.category)}>{product.category}</Badge>
                      <Badge variant="outline" className="text-xs">
                        {product.unit}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 mb-3">
                      <span className="font-medium">Supplier:</span> {product.supplier}
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleSelectProduct(product)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Inventory
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No products found matching your search.
              </div>
            )}

            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) {
                          setCurrentPage(currentPage - 1)
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {getPageNumbers().map((page, index) => {
                    if (page === "ellipsis-start" || page === "ellipsis-end") {
                      return (
                        <PaginationItem key={`ellipsis-${index}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )
                    }

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(page as number)
                            window.scrollTo({ top: 0, behavior: "smooth" })
                          }}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage < totalPages) {
                          setCurrentPage(currentPage + 1)
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add {selectedProduct?.name} to Inventory</DialogTitle>
            <DialogDescription>
              Enter the initial quantity, threshold, and order amount for this product.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="currentQuantity">
                Current Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="currentQuantity"
                type="number"
                min="0"
                placeholder="Enter current stock quantity"
                value={formData.currentQuantity}
                onChange={(e) =>
                  setFormData({ ...formData, currentQuantity: e.target.value })
                }
              />
              <p className="text-xs text-gray-500">
                Current stock level for {selectedProduct?.name}
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="threshold">
                Threshold (Reorder Point) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="threshold"
                type="number"
                min="0"
                placeholder="Enter threshold quantity"
                value={formData.threshold}
                onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
              />
              <p className="text-xs text-gray-500">
                When stock falls to this level, an order will be triggered
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="orderAmount">
                Order Amount <span className="text-red-500">*</span>
              </Label>
              <Input
                id="orderAmount"
                type="number"
                min="0"
                placeholder="Enter quantity to order"
                value={formData.orderAmount}
                onChange={(e) => setFormData({ ...formData, orderAmount: e.target.value })}
              />
              <p className="text-xs text-gray-500">
                Quantity to automatically order when threshold is reached
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddToInventory} disabled={isAdding}>
              {isAdding ? "Adding..." : "Add to Inventory"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

