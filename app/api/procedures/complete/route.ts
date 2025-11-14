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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { procedureId, items } = body

    // Validate required fields
    if (!procedureId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: procedureId and items are required" },
        { status: 400 }
      )
    }

    const insufficientItems: Array<{ name: string; available: number; required: number }> = []

    // Check if all items have sufficient quantity
    for (const item of items) {
      const inventoryItem = inventoryData.find((inv) => inv.id === item.inventoryItemId)
      
      if (!inventoryItem) {
        return NextResponse.json(
          { error: `Inventory item with ID ${item.inventoryItemId} not found` },
          { status: 404 }
        )
      }

      if (inventoryItem.quantity < item.quantity) {
        insufficientItems.push({
          name: inventoryItem.name,
          available: inventoryItem.quantity,
          required: item.quantity,
        })
      }
    }

    // If there are insufficient items, return error
    if (insufficientItems.length > 0) {
      return NextResponse.json(
        {
          error: "Insufficient inventory for procedure",
          insufficientItems,
        },
        { status: 400 }
      )
    }

    // Deduct quantities from inventory
    for (const item of items) {
      const inventoryItem = inventoryData.find((inv) => inv.id === item.inventoryItemId)
      if (inventoryItem) {
        inventoryItem.quantity -= item.quantity
        
        // Update status based on new quantity
        if (inventoryItem.quantity === 0) {
          inventoryItem.status = "Out"
        } else if (inventoryItem.quantity <= inventoryItem.threshold) {
          inventoryItem.status = "Low"
        } else {
          inventoryItem.status = "OK"
        }
        
        inventoryItem.lastUpdated = new Date().toISOString().split("T")[0]
      }
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return NextResponse.json({
      success: true,
      message: "Procedure completed successfully. Inventory items have been deducted.",
      updatedInventory: inventoryData,
    })
  } catch (error) {
    console.error("[PROCEDURE_COMPLETE_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to complete procedure. Please try again." },
      { status: 500 }
    )
  }
}

