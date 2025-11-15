import { NextResponse, type NextRequest } from "next/server"

// In-memory storage for demo purposes (in production, this would be in a database)
export let inventoryData = [
    {
      id: 1,
      name: "Dental Floss",
      quantity: 5,
      threshold: 20,
      status: "Low",
      category: "Hygiene",
      supplier: "DentalCorp",
      lastUpdated: "2024-01-15",
      orderAmount: 50,
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
      orderAmount: 100,
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
      orderAmount: 50,
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
      orderAmount: 30,
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
      orderAmount: 50,
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
      orderAmount: 20,
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
      orderAmount: 200,
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
      orderAmount: 30,
    },
  ]

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return NextResponse.json(inventoryData)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, quantity, threshold, orderAmount, category, supplier } = body

    // Validate required fields
    if (!name || quantity === undefined || threshold === undefined || orderAmount === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: name, quantity, threshold, and orderAmount are required" },
        { status: 400 }
      )
    }

    // Validate numeric values
    const qty = Number.parseInt(quantity)
    const thresh = Number.parseInt(threshold)
    const orderQty = Number.parseInt(orderAmount)

    if (Number.isNaN(qty) || Number.isNaN(thresh) || Number.isNaN(orderQty)) {
      return NextResponse.json(
        { error: "Quantity, threshold, and orderAmount must be valid numbers" },
        { status: 400 }
      )
    }

    if (qty < 0 || thresh < 0 || orderQty < 0) {
      return NextResponse.json(
        { error: "Quantity, threshold, and orderAmount must be non-negative numbers" },
        { status: 400 }
      )
    }

    // Check if product already exists
    const existingProduct = inventoryData.find(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    )

    if (existingProduct) {
      return NextResponse.json(
        { error: `Product "${name}" already exists in inventory. Please update the existing item instead.` },
        { status: 409 }
      )
    }

    // Determine status based on quantity and threshold
    let status = "OK"
    if (qty === 0) {
      status = "Out"
    } else if (qty <= thresh) {
      status = "Low"
    }

    // Create new inventory item
    const newItem = {
      id: Math.max(...inventoryData.map((item) => item.id), 0) + 1,
      name,
      quantity: qty,
      threshold: thresh,
      status,
      category: category || "Uncategorized",
      supplier: supplier || "Unknown",
      lastUpdated: new Date().toISOString().split("T")[0],
      orderAmount: orderQty, // Store the order amount for future use
    }

    // Add to inventory
    inventoryData.push(newItem)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return NextResponse.json(
      {
        success: true,
        message: `Product "${name}" has been added to inventory successfully.`,
        item: newItem,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[INVENTORY_ADD_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to add product to inventory. Please try again." },
      { status: 500 }
    )
  }
}
