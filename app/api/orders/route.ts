import { NextResponse, type NextRequest } from "next/server"

// In-memory inventory storage (should match the one in /api/inventory/route.ts)
// In production, this would be a shared database
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

const orders = [
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
  },
]

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return NextResponse.json(orders)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { product, quantity, supplier, totalAmount, deliveryDate, trackingNumber, category, isNewProduct } = body

    // Validate required fields
    if (!product || !quantity || !supplier || !deliveryDate) {
      return NextResponse.json(
        { error: "Missing required fields: product, quantity, supplier, and deliveryDate are required" },
        { status: 400 }
      )
    }

    const qty = Number.parseInt(quantity)
    if (Number.isNaN(qty) || qty <= 0) {
      return NextResponse.json(
        { error: "Quantity must be a positive number" },
        { status: 400 }
      )
    }

    // Check if product exists in inventory
    let inventoryItem = inventoryData.find(
      (item) => item.name.toLowerCase() === product.toLowerCase()
    )

    // If product doesn't exist and isNewProduct is true, add it to inventory with quantity 0
    if (!inventoryItem && isNewProduct) {
      const newInventoryItem = {
        id: Math.max(...inventoryData.map((item) => item.id), 0) + 1,
        name: product,
        quantity: 0, // Start with 0 until delivered
        threshold: Math.ceil(qty * 0.2), // Default threshold as 20% of order quantity
        status: "Out",
        category: category || "Uncategorized",
        supplier: supplier,
        lastUpdated: new Date().toISOString().split("T")[0],
      }
      inventoryData.push(newInventoryItem)
      inventoryItem = newInventoryItem
    }

    const maxId = orders.length > 0 
      ? Math.max(...orders.map((o) => Number.parseInt(o.id.replace("ORD-", "")) || 0))
      : 0
    const orderId = `ORD-${String(maxId + 1).padStart(3, "0")}`

    // Create new order
    const newOrder = {
      id: orderId,
      product: product,
      quantity: qty,
      status: "pending",
      deliveryDate: deliveryDate,
      orderDate: new Date().toISOString().split("T")[0],
      supplier: supplier,
      totalAmount: totalAmount || 0,
      trackingNumber: trackingNumber || `TRK-${Date.now()}`,
      inventoryItemId: inventoryItem?.id, // Store reference to inventory item
    }

    orders.push(newOrder)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return NextResponse.json(
      {
        success: true,
        message: `Order ${orderId} created successfully.${isNewProduct ? " Product added to inventory with quantity 0." : ""}`,
        order: newOrder,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[ORDER_CREATE_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to create order. Please try again." },
      { status: 500 }
    )
  }
}
