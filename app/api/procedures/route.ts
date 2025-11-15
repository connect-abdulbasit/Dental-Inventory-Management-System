import { NextResponse, type NextRequest } from "next/server"

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

// In-memory storage for demo purposes (in production, this would be in a database)
let procedures: Procedure[] = [
  {
    id: 1,
    name: "Routine Cleaning",
    items: [
      { inventoryItemId: 1, inventoryItemName: "Dental Floss", quantity: 1 },
      { inventoryItemId: 2, inventoryItemName: "Disposable Gloves", quantity: 2 },
      { inventoryItemId: 7, inventoryItemName: "Suction Tips", quantity: 1 },
    ],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    name: "Tooth Filling",
    items: [
      { inventoryItemId: 2, inventoryItemName: "Disposable Gloves", quantity: 2 },
      { inventoryItemId: 3, inventoryItemName: "Anesthetic Cartridges", quantity: 1 },
      { inventoryItemId: 4, inventoryItemName: "Composite Filling Material", quantity: 1 },
      { inventoryItemId: 7, inventoryItemName: "Suction Tips", quantity: 2 },
    ],
    createdAt: "2024-01-14T14:30:00Z",
    updatedAt: "2024-01-14T14:30:00Z",
  },
]

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return NextResponse.json(procedures)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, items } = body

    // Validate required fields
    if (!name || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: name and items (non-empty array) are required" },
        { status: 400 }
      )
    }

    // Validate items
    for (const item of items) {
      if (!item.inventoryItemId || item.quantity === undefined) {
        return NextResponse.json(
          { error: "Each item must have inventoryItemId and quantity" },
          { status: 400 }
        )
      }

      const qty = Number.parseInt(item.quantity)
      if (Number.isNaN(qty) || qty <= 0) {
        return NextResponse.json(
          { error: "Item quantity must be a positive number" },
          { status: 400 }
        )
      }
    }

    // Check if procedure with same name already exists
    const existingProcedure = procedures.find(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    )

    if (existingProcedure) {
      return NextResponse.json(
        { error: `Procedure "${name}" already exists. Please use a different name.` },
        { status: 409 }
      )
    }

    // Create new procedure
    const newProcedure: Procedure = {
      id: Math.max(...procedures.map((p) => p.id), 0) + 1,
      name,
      items: items.map((item: any) => ({
        inventoryItemId: item.inventoryItemId,
        inventoryItemName: item.inventoryItemName || "",
        quantity: Number.parseInt(item.quantity),
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    procedures.push(newProcedure)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return NextResponse.json(
      {
        success: true,
        message: `Procedure "${name}" has been created successfully.`,
        procedure: newProcedure,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[PROCEDURE_CREATE_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to create procedure. Please try again." },
      { status: 500 }
    )
  }
}

