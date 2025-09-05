import { NextResponse } from "next/server"

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const inventoryData = [
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

  return NextResponse.json(inventoryData)
}
