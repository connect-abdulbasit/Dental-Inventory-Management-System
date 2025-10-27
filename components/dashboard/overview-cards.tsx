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
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
    },
    {
      title: "Low Stock Alerts",
      value: data.lowStockAlerts.toString(),
      icon: AlertTriangle,
      description: "Items need restocking",
      color: "text-red-600",
      bgColor: "bg-red-50",
      iconBg: "bg-red-100",
    },
    {
      title: "Upcoming Appointments",
      value: data.upcomingAppointments.toString(),
      icon: Calendar,
      description: "Today's schedule",
      color: "text-green-600",
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
    },
    {
      title: "Today's Revenue",
      value: `$${data.todayRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: "Daily earnings",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100",
    },
    {
      title: "Monthly Revenue",
      value: `$${data.monthlyRevenue.toLocaleString()}`,
      icon: TrendingUp,
      description: "This month's total",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      iconBg: "bg-indigo-100",
    },
    {
      title: "Active Patients",
      value: data.activePatients.toString(),
      icon: Users,
      description: "Registered patients",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      iconBg: "bg-cyan-100",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title} className={`hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${card.bgColor} border-0`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">{card.title}</CardTitle>
              <div className={`w-10 h-10 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">{card.value}</div>
              <p className="text-sm text-gray-600">{card.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
