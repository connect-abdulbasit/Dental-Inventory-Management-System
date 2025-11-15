import { type NextRequest, NextResponse } from "next/server"
import { inventoryData } from "../route"

export async function POST(request: NextRequest) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const { productId, newQuantity, newThreshold, newOrderAmount, deductQuantity, reason } = await request.json()

  if (!productId) {
    return NextResponse.json({ error: "Missing required field: productId" }, { status: 400 })
  }

  // Find the inventory item
  const item = inventoryData.find((item) => item.id === productId)
  if (!item) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  // Handle deduction
  if (deductQuantity !== undefined) {
    const deductQty = Number.parseInt(deductQuantity)
    if (Number.isNaN(deductQty) || deductQty <= 0) {
      return NextResponse.json({ error: "Deduct quantity must be a positive number" }, { status: 400 })
    }

    if (item.quantity < deductQty) {
      return NextResponse.json(
        { error: `Insufficient quantity. Available: ${item.quantity}, Requested: ${deductQty}` },
        { status: 400 }
      )
    }

    item.quantity -= deductQty
  } else if (newQuantity !== undefined) {
    // Handle full inventory update (quantity, threshold, orderAmount)
    const qty = Number.parseInt(newQuantity)
    const threshold = newThreshold !== undefined ? Number.parseInt(newThreshold) : item.threshold
    const orderAmount = newOrderAmount !== undefined ? Number.parseInt(newOrderAmount) : (item.orderAmount || 0)

    if (Number.isNaN(qty) || qty < 0) {
      return NextResponse.json({ error: "Quantity must be a non-negative number" }, { status: 400 })
    }
    if (Number.isNaN(threshold) || threshold < 0) {
      return NextResponse.json({ error: "Threshold must be a non-negative number" }, { status: 400 })
    }
    if (Number.isNaN(orderAmount) || orderAmount < 0) {
      return NextResponse.json({ error: "Order amount must be a non-negative number" }, { status: 400 })
    }

    item.quantity = qty
    item.threshold = threshold
    item.orderAmount = orderAmount
  } else {
    return NextResponse.json({ error: "Either newQuantity or deductQuantity must be provided" }, { status: 400 })
  }

  // Update status based on new quantity
  if (item.quantity === 0) {
    item.status = "Out"
  } else if (item.quantity <= item.threshold) {
    item.status = "Low"
  } else {
    item.status = "OK"
  }

  item.lastUpdated = new Date().toISOString().split("T")[0]

  const result = {
    success: true,
    message: deductQuantity !== undefined
      ? `Successfully deducted ${deductQuantity} units${reason ? ` (${reason})` : ""}`
      : `Inventory updated successfully`,
    productId,
    newQuantity: item.quantity,
    newThreshold: item.threshold,
    newOrderAmount: item.orderAmount,
    deductedQuantity: deductQuantity,
    reason: reason || null,
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json(result)
}
