"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, TrendingUp, DollarSign } from "lucide-react"

interface SupplierDashboardData {
  totalProducts: number
  activeOrders: number
  completedOrders: number
  totalRevenue: number
  monthlyRevenue: number
  pendingOrders: number
}

export default function SupplierDashboardPage() {
  const [data, setData] = useState<SupplierDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchDashboardData = async () => {
    try {
      // In production, this would fetch from /api/supplier/dashboard
      // For now, using mock data
      const mockData: SupplierDashboardData = {
        totalProducts: 45,
        activeOrders: 12,
        completedOrders: 128,
        totalRevenue: 125000,
        monthlyRevenue: 15000,
        pendingOrders: 5,
      }
      setData(mockData)
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Dashboard" description="Overview of your supplier business" />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div>
        <PageHeader title="Dashboard" description="Overview of your supplier business" />
        <div className="text-center py-12">
          <p className="text-red-600">Failed to load dashboard data</p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: "Total Products",
      value: data.totalProducts,
      icon: Package,
      description: "Products in catalog",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Orders",
      value: data.activeOrders,
      icon: ShoppingCart,
      description: "Orders in progress",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Pending Orders",
      value: data.pendingOrders,
      icon: ShoppingCart,
      description: "Awaiting confirmation",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Monthly Revenue",
      value: `PKR ${data.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: "This month",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Revenue",
      value: `PKR ${data.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      description: "All time",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
    {
      title: "Completed Orders",
      value: data.completedOrders,
      icon: ShoppingCart,
      description: "Total fulfilled",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
  ]

  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" description="Overview of your supplier business" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New order received</p>
                  <p className="text-xs text-muted-foreground">Order #1234 from Karachi Dental Care</p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Product updated</p>
                  <p className="text-xs text-muted-foreground">Dental Floss - Stock updated</p>
                  <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Order completed</p>
                  <p className="text-xs text-muted-foreground">Order #1230 delivered successfully</p>
                  <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <a
                href="/supplier/products"
                className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <p className="font-medium">Manage Products</p>
                <p className="text-sm text-muted-foreground">Add or update product catalog</p>
              </a>
              <a
                href="/supplier/orders"
                className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <p className="font-medium">View Orders</p>
                <p className="text-sm text-muted-foreground">Check and manage incoming orders</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

