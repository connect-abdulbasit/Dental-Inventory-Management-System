"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Truck, CheckCircle, Clock, DollarSign } from "lucide-react"

interface Order {
  id: string
  product: string
  quantity: number
  status: string
  deliveryDate: string
  orderDate: string
  supplier: string
  totalAmount: number
  trackingNumber: string
}

interface OrderStatsProps {
  orders: Order[]
}

export function OrderStats({ orders }: OrderStatsProps) {
  const stats = {
    total: orders.length,
    pending: orders.filter((order) => order.status === "pending").length,
    shipped: orders.filter((order) => order.status === "shipped").length,
    delivered: orders.filter((order) => order.status === "delivered").length,
    totalValue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const statCards = [
    {
      title: "Total Orders",
      value: stats.total.toString(),
      icon: Package,
      description: "All orders",
      color: "text-blue-600",
    },
    {
      title: "Pending Orders",
      value: stats.pending.toString(),
      icon: Clock,
      description: "Awaiting shipment",
      color: "text-yellow-600",
    },
    {
      title: "Shipped Orders",
      value: stats.shipped.toString(),
      icon: Truck,
      description: "In transit",
      color: "text-blue-600",
    },
    {
      title: "Delivered Orders",
      value: stats.delivered.toString(),
      icon: CheckCircle,
      description: "Successfully delivered",
      color: "text-green-600",
    },
    {
      title: "Total Value",
      value: formatCurrency(stats.totalValue),
      icon: DollarSign,
      description: "All orders combined",
      color: "text-purple-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
