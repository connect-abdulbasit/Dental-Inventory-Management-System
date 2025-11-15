import { NextResponse } from "next/server"
export async function GET() {

  const dashboardData = {
    totalProducts: 247,
    lowStockAlerts: 12,
    upcomingAppointments: 8,
    todayRevenue: 2850,
    monthlyRevenue: 45200,
    activePatients: 156,
    recentActivity: [
      {
        id: 1,
        type: "appointment",
        message: "New appointment scheduled with John Doe",
        time: "2 hours ago",
      },
      {
        id: 2,
        type: "inventory",
        message: "Low stock alert: Dental Floss (5 units remaining)",
        time: "4 hours ago",
      },
      {
        id: 3,
        type: "order",
        message: "Order #1234 delivered successfully",
        time: "6 hours ago",
      },
    ],
    lowStockItems: [
      { name: "Dental Floss", quantity: 5, threshold: 20 },
      { name: "Disposable Gloves", quantity: 15, threshold: 50 },
      { name: "Anesthetic Cartridges", quantity: 8, threshold: 25 },
    ],
  }

  return NextResponse.json(dashboardData)
}
