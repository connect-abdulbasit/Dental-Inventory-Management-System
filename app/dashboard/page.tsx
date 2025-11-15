"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { PageHeader } from "@/components/page-header"
import { OverviewCards } from "@/components/dashboard/overview-cards"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { PastAppointments } from "@/components/dashboard/past-appointments"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Redirect suppliers to supplier dashboard
  useEffect(() => {
    if (!authLoading && user?.role === "supplier") {
      router.push("/supplier/dashboard")
    }
  }, [user, authLoading, router])

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

  // Don't render clinic dashboard for suppliers
  if (authLoading || user?.role === "supplier") {
    return (
      <div className="flex items-center justify-center py-12">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader title="Dashboard" description="Overview of your dental practice" />

        {/* Overview Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-10 rounded-lg" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-9 w-24 mb-2" />
                <Skeleton className="h-4 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity and Past Appointments Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity Skeleton */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Past Appointments Skeleton */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-6 rounded-full ml-auto" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="border rounded-lg p-2.5">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Skeleton className="h-3.5 w-3.5 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-3 w-36" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <div className="flex gap-2 pt-2 border-t mt-2">
                      <Skeleton className="h-7 flex-1" />
                      <Skeleton className="h-7 flex-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
