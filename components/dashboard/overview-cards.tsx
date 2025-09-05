"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertTriangle, Calendar, DollarSign, Users, TrendingUp } from "lucide-react"

interface OverviewCardsProps {
  data: {
    totalProducts: number
    lowStockAlerts: number
    upcomingAppointments: number
    todayRevenue: number
    monthlyRevenue: number
    activePatients: number
  }
}

export function OverviewCards({ data }: OverviewCardsProps) {
  const cards = [
    {
      title: "Total Products",
      value: data.totalProducts.toString(),
      icon: Package,
      description: "Items in inventory",
      color: "text-blue-600",
    },
    {
      title: "Low Stock Alerts",
      value: data.lowStockAlerts.toString(),
      icon: AlertTriangle,
      description: "Items need restocking",
      color: "text-red-600",
    },
    {
      title: "Upcoming Appointments",
      value: data.upcomingAppointments.toString(),
      icon: Calendar,
      description: "Today's schedule",
      color: "text-green-600",
    },
    {
      title: "Today's Revenue",
      value: `$${data.todayRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: "Daily earnings",
      color: "text-purple-600",
    },
    {
      title: "Monthly Revenue",
      value: `$${data.monthlyRevenue.toLocaleString()}`,
      icon: TrendingUp,
      description: "This month's total",
      color: "text-indigo-600",
    },
    {
      title: "Active Patients",
      value: data.activePatients.toString(),
      icon: Users,
      description: "Registered patients",
      color: "text-teal-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
              <Icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{card.value}</div>
              <p className="text-xs text-gray-500 mt-1">{card.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
