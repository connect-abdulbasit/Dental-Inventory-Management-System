import { NextResponse, type NextRequest } from "next/server"

// In-memory storage (should match the one in /api/orders/route.ts)
// In production, this would be a shared database
let orders = [
  {
    id: "ORD-001",
    product: "Dental Floss (Pack of 50)",
    quantity: 10,
    status: "pending",
    deliveryDate: "2024-01-25",
    orderDate: "2024-01-18",
    supplier: "DentalCorp",
    totalAmount: 125.5,
    trackingNumber: "DC123456789",
    inventoryItemId: 1,
  },
  {
    id: "ORD-002",
    product: "Disposable Gloves (Box of 100)",
    quantity: 25,
    status: "shipped",
    deliveryDate: "2024-01-22",
    orderDate: "2024-01-15",
    supplier: "MedSupply Inc",
    totalAmount: 487.75,
    trackingNumber: "MS987654321",
    inventoryItemId: 2,
  },
  {
    id: "ORD-003",
    product: "Anesthetic Cartridges",
    quantity: 50,
    status: "delivered",
    deliveryDate: "2024-01-20",
    orderDate: "2024-01-12",
    supplier: "PharmaDental",
    totalAmount: 892.0,
    trackingNumber: "PD456789123",
    inventoryItemId: 3,
  },
  {
    id: "ORD-004",
    product: "Composite Filling Material",
    quantity: 15,
    status: "pending",
    deliveryDate: "2024-01-28",
    orderDate: "2024-01-19",
    supplier: "DentalCorp",
    totalAmount: 675.25,
    trackingNumber: "DC789123456",
    inventoryItemId: 4,
  },
  {
    id: "ORD-005",
    product: "X-Ray Films (Pack of 100)",
    quantity: 5,
    status: "shipped",
    deliveryDate: "2024-01-24",
    orderDate: "2024-01-16",
    supplier: "RadiologyPlus",
    totalAmount: 234.99,
    trackingNumber: "RP321654987",
    inventoryItemId: 5,
  },
  {
    id: "ORD-006",
    product: "Dental Mirrors (Set of 12)",
    quantity: 8,
    status: "delivered",
    deliveryDate: "2024-01-19",
    orderDate: "2024-01-10",
    supplier: "InstrumentCo",
    totalAmount: 156.8,
    trackingNumber: "IC654987321",
    inventoryItemId: 6,
  },
  {
    id: "ORD-007",
    product: "Suction Tips (Pack of 200)",
    quantity: 20,
    status: "pending",
    deliveryDate: "2024-01-30",
    orderDate: "2024-01-20",
    supplier: "DentalCorp",
    totalAmount: 298.4,
    trackingNumber: "DC147258369",
    inventoryItemId: 7,
  },
  {
    id: "ORD-008",
    product: "Fluoride Gel (12 tubes)",
    quantity: 6,
    status: "shipped",
    deliveryDate: "2024-01-26",
    orderDate: "2024-01-17",
    supplier: "PharmaDental",
    totalAmount: 189.75,
    trackingNumber: "PD963852741",
    inventoryItemId: 8,
  },
]

// In-memory inventory storage (should match the one in /api/inventory/route.ts)
let inventoryData = [
  {
    id: 1,
    name: "Dental Floss",
    quantity: 5,
    threshold: 20,
    status: "Low",
    category: "Hygiene",
    supplier: "DentalCorp",
    lastUpdated: "2024-01-15",
  },
  {
    id: 2,
    name: "Disposable Gloves (Box)",
    quantity: 15,
    threshold: 50,
    status: "Low",
    category: "Safety",
    supplier: "MedSupply Inc",
    lastUpdated: "2024-01-14",
  },
  {
    id: 3,
    name: "Anesthetic Cartridges",
    quantity: 8,
    threshold: 25,
    status: "Low",
    category: "Medication",
    supplier: "PharmaDental",
    lastUpdated: "2024-01-13",
  },
  {
    id: 4,
    name: "Composite Filling Material",
    quantity: 45,
    threshold: 30,
    status: "OK",
    category: "Materials",
    supplier: "DentalCorp",
    lastUpdated: "2024-01-12",
  },
  {
    id: 5,
    name: "X-Ray Films",
    quantity: 120,
    threshold: 40,
    status: "OK",
    category: "Imaging",
    supplier: "RadiologyPlus",
    lastUpdated: "2024-01-11",
  },
  {
    id: 6,
    name: "Dental Mirrors",
    quantity: 75,
    threshold: 20,
    status: "OK",
    category: "Instruments",
    supplier: "InstrumentCo",
    lastUpdated: "2024-01-10",
  },
  {
    id: 7,
    name: "Suction Tips",
    quantity: 200,
    threshold: 100,
    status: "OK",
    category: "Disposables",
    supplier: "DentalCorp",
    lastUpdated: "2024-01-09",
  },
  {
    id: 8,
    name: "Fluoride Gel",
    quantity: 25,
    threshold: 15,
    status: "OK",
    category: "Treatment",
    supplier: "PharmaDental",
    lastUpdated: "2024-01-08",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { orderId, status } = await request.json()

    if (!orderId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Find the order
    const order = orders.find((o) => o.id === orderId)
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const previousStatus = order.status
    order.status = status

    // If status changed to "delivered", update inventory quantity
    if (status === "delivered" && previousStatus !== "delivered") {
      if (order.inventoryItemId) {
        const inventoryItem = inventoryData.find((item) => item.id === order.inventoryItemId)
        if (inventoryItem) {
          // Add the ordered quantity to inventory
          inventoryItem.quantity += order.quantity
          
          // Update status based on new quantity
          if (inventoryItem.quantity === 0) {
            inventoryItem.status = "Out"
          } else if (inventoryItem.quantity <= inventoryItem.threshold) {
            inventoryItem.status = "Low"
          } else {
            inventoryItem.status = "OK"
          }
          
          inventoryItem.lastUpdated = new Date().toISOString().split("T")[0]
        } else {
          // If inventory item not found, try to find by product name
          const inventoryItemByName = inventoryData.find(
            (item) => item.name.toLowerCase() === order.product.toLowerCase()
          )
          if (inventoryItemByName) {
            inventoryItemByName.quantity += order.quantity
            
            if (inventoryItemByName.quantity === 0) {
              inventoryItemByName.status = "Out"
            } else if (inventoryItemByName.quantity <= inventoryItemByName.threshold) {
              inventoryItemByName.status = "Low"
            } else {
              inventoryItemByName.status = "OK"
            }
            
            inventoryItemByName.lastUpdated = new Date().toISOString().split("T")[0]
          }
        }
      }
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: `Order ${orderId} marked as ${status}.${status === "delivered" ? " Inventory quantity has been updated." : ""}`,
      orderId,
      newStatus: status,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[ORDER_UPDATE_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to update order. Please try again." },
      { status: 500 }
    )
  }
}
