"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { OverviewCards } from "@/components/dashboard/overview-cards"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { LowStockAlerts } from "@/components/dashboard/low-stock-alerts"

interface DashboardData {
  totalProducts: number
  lowStockAlerts: number
  upcomingAppointments: number
  todayRevenue: number
  monthlyRevenue: number
  activePatients: number
  recentActivity: Array<{
    id: number
    type: string
    message: string
    time: string
  }>
  lowStockItems: Array<{
    name: string
    quantity: number
    threshold: number
  }>
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard")
        const dashboardData = await response.json()
        setData(dashboardData)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Dashboard" description="Overview of your dental practice" />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div>
        <PageHeader title="Dashboard" description="Overview of your dental practice" />
        <div className="text-center py-12">
          <p className="text-red-600">Failed to load dashboard data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" description="Overview of your dental practice" />

      <OverviewCards data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity activities={data.recentActivity} />
        <LowStockAlerts items={data.lowStockItems} />
      </div>
    </div>
  )
}
