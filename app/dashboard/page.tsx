"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { OverviewCards } from "@/components/dashboard/overview-cards"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { PastAppointments } from "@/components/dashboard/past-appointments"

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

interface Appointment {
  id: number
  patientName: string
  patientEmail: string
  patientPhone: string
  date: string
  time: string
  duration: number
  type: string
  procedureName?: string
  status: string
  notes: string
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchDashboardData = async () => {
    try {
      const [dashboardResponse, appointmentsResponse] = await Promise.all([
        fetch("/api/dashboard"),
        fetch("/api/appointments"),
      ])
      const dashboardData = await dashboardResponse.json()
      const appointmentsData = await appointmentsResponse.json()
      setData(dashboardData)
      setAppointments(appointmentsData)
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
        <div>
          <RecentActivity activities={data.recentActivity} />
        </div>
        <div>

          <PastAppointments appointments={appointments} onUpdate={fetchDashboardData} />
        </div>
      </div>
    </div>
  )
}
