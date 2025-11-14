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
import { Package, Plus, Search, ShoppingCart, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/lib/cart-context"
import { Skeleton } from "@/components/ui/skeleton"
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
  price: number
  image_url: string
  category?: string
  supplier?: string
  unit?: string
}

interface ProductCatalogProps {
  onProductAdded: () => void
}

const ITEMS_PER_PAGE = 12

export function ProductCatalog({ onProductAdded }: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [productDetailsModal, setProductDetailsModal] = useState<Product | null>(null)
  const [availableProducts, setAvailableProducts] = useState<Product[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [formData, setFormData] = useState({
    currentQuantity: "",
    threshold: "",
    orderAmount: "",
  })
  const [isAdding, setIsAdding] = useState(false)
  const [cartQuantityDialog, setCartQuantityDialog] = useState<{ product: Product | null; quantity: string }>({
    product: null,
    quantity: "1",
  })
  const [recentlyAddedToCart, setRecentlyAddedToCart] = useState<Set<string>>(new Set())
  const { toast } = useToast()
  const { addToCart } = useCart()

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingProducts(true)
      try {
        const response = await fetch("/api/products")
        if (response.ok) {
          const data = await response.json()
          setAvailableProducts(data)
        } else {
          toast({
            title: "Error",
            description: "Failed to load products",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        })
      } finally {
        setIsLoadingProducts(false)
      }
    }

    fetchProducts()
  }, [toast])

  const filteredProducts = useMemo(
    () =>
      availableProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (product.supplier && product.supplier.toLowerCase().includes(searchQuery.toLowerCase())),
      ),
    [searchQuery, availableProducts],
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

  const getCategoryColor = (category?: string) => {
    if (!category) return "bg-gray-100 text-gray-700 border-gray-200"
    const colors: Record<string, string> = {
      Hygiene: "bg-blue-100 text-blue-700 border-blue-200",
      Safety: "bg-red-100 text-red-700 border-red-200",
      Medication: "bg-purple-100 text-purple-700 border-purple-200",
      Materials: "bg-green-100 text-green-700 border-green-200",
      Imaging: "bg-yellow-100 text-yellow-700 border-yellow-200",
      Instruments: "bg-indigo-100 text-indigo-700 border-indigo-200",
      Disposables: "bg-gray-100 text-gray-700 border-gray-200",
      Treatment: "bg-pink-100 text-pink-700 border-pink-200",
      "Lab Equipment": "bg-cyan-100 text-cyan-700 border-cyan-200",
      Equipment: "bg-orange-100 text-orange-700 border-orange-200",
      Implants: "bg-teal-100 text-teal-700 border-teal-200",
      Maintenance: "bg-amber-100 text-amber-700 border-amber-200",
      Accessories: "bg-slate-100 text-slate-700 border-slate-200",
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

            {isLoadingProducts ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                  <Card key={`skeleton-${index}`} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="mb-3">
                        <Skeleton className="w-full h-48 rounded-lg mb-3" />
                      </div>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <Skeleton className="h-5 w-full mb-2" />
                          <Skeleton className="h-4 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>
                      <Skeleton className="h-4 w-32 mb-3" />
                      <div className="flex gap-2">
                        <Skeleton className="h-9 flex-1 rounded-md" />
                        <Skeleton className="h-9 flex-1 rounded-md" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    // Just show the product from the already-fetched list
                    setProductDetailsModal(product)
                  }}
                >
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-48 object-contain bg-gray-50 rounded-lg mb-3"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "https://via.placeholder.com/300x200?text=No+Image"
                        }}
                      />
                    </div>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h4>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {product.category && (
                        <Badge className={getCategoryColor(product.category)}>{product.category}</Badge>
                      )}
                      <Badge variant="outline" className="text-xs font-semibold">
                        ${product.price.toFixed(2)}
                      </Badge>
                    </div>
                    {product.supplier && (
                      <div className="text-xs text-gray-500 mb-3">
                        <span className="font-medium">Supplier:</span> {product.supplier}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          setCartQuantityDialog({ product, quantity: "1" })
                        }}
                      >
                        {recentlyAddedToCart.has(product.name) ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Added
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSelectProduct(product)
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Inventory
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            )}

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

      {/* Cart Quantity Dialog */}
      <Dialog
        open={cartQuantityDialog.product !== null}
        onOpenChange={(open) => {
          if (!open) {
            setCartQuantityDialog({ product: null, quantity: "1" })
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add {cartQuantityDialog.product?.name} to Cart</DialogTitle>
            <DialogDescription>Enter the quantity you want to add to your cart.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cartQuantity">
                Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cartQuantity"
                type="number"
                min="1"
                placeholder="Enter quantity"
                value={cartQuantityDialog.quantity}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === "" || (Number.parseInt(value) > 0 && Number.parseInt(value) <= 10000)) {
                    setCartQuantityDialog({ ...cartQuantityDialog, quantity: value })
                  }
                }}
                autoFocus
              />
              <p className="text-xs text-gray-500">
                How many units of {cartQuantityDialog.product?.name} do you want to order?
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCartQuantityDialog({ product: null, quantity: "1" })}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                const quantity = Number.parseInt(cartQuantityDialog.quantity)
                if (!quantity || quantity < 1) {
                  toast({
                    title: "Invalid quantity",
                    description: "Please enter a valid quantity greater than 0.",
                    variant: "destructive",
                  })
                  return
                }

                if (cartQuantityDialog.product) {
                  addToCart({
                    productName: cartQuantityDialog.product.name,
                    quantity: quantity,
                    category: cartQuantityDialog.product.category,
                    supplier: cartQuantityDialog.product.supplier,
                  })

                  // Show success state
                  setRecentlyAddedToCart((prev) => new Set(prev).add(cartQuantityDialog.product!.name))
                  
                  // Remove success state after 3 seconds
                  setTimeout(() => {
                    setRecentlyAddedToCart((prev) => {
                      const newSet = new Set(prev)
                      newSet.delete(cartQuantityDialog.product!.name)
                      return newSet
                    })
                  }, 3000)

                  toast({
                    title: "Added to cart",
                    description: `${quantity} x ${cartQuantityDialog.product.name} has been added to your cart.`,
                  })

                  setCartQuantityDialog({ product: null, quantity: "1" })
                }
              }}
            >
              <Check className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Details Modal */}
      <Dialog open={productDetailsModal !== null} onOpenChange={(open) => {
        if (!open) {
          setProductDetailsModal(null)
        }
      }}>
        <DialogContent className="max-w-7xl max-h-[90vh] w-[95vw] sm:w-[90vw] p-6 sm:p-8 overflow-y-auto">
          {productDetailsModal ? (
            <div className="space-y-6">
              {/* Header with Title */}
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 pr-8">
                  {productDetailsModal.name}
                </DialogTitle>
              </DialogHeader>

              {/* Image and Price Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image */}
                <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center min-h-[250px] sm:min-h-[300px]">
                  <img
                    src={productDetailsModal.image_url}
                    alt={productDetailsModal.name}
                    className="max-w-full max-h-[250px] sm:max-h-[300px] object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "https://via.placeholder.com/500x400?text=No+Image"
                    }}
                  />
                </div>

                {/* Price Card */}
                <div className="flex items-center justify-center">
                  <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200 w-full text-center">
                    <div className="text-sm font-medium text-gray-600 mb-2">Price</div>
                    <div className="text-3xl sm:text-4xl font-bold text-blue-600">
                      ${productDetailsModal.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3 pt-4 border-t">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Description</h3>
                <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {productDetailsModal.description}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}

