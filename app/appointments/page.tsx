"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { CalendarView } from "@/components/appointments/calendar-view"
import { AppointmentsList } from "@/components/appointments/appointments-list"
import { AppointmentModal } from "@/components/appointments/appointment-modal"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, RefreshCw, Calendar, List } from "lucide-react"

interface Appointment {
  id: number
  patientName: string
  patientEmail: string
  patientPhone: string
  date: string
  time: string
  duration: number
  type?: string
  procedureName?: string
  status: string
  notes: string
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"view" | "edit" | "create">("view")

  const fetchAppointments = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/appointments")
      const data = await response.json()
      setAppointments(data)
    } catch (error) {
      console.error("Failed to fetch appointments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setModalMode("view")
    setIsModalOpen(true)
  }

  const handleNewAppointment = () => {
    setSelectedAppointment(null)
    setModalMode("create")
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedAppointment(null)
  }

  const handleModalSave = () => {
    fetchAppointments()
  }

  if (isLoading) {
    return (
      <div>
        <PageHeader 
          title="Appointments" 
          description="Manage patient appointments and schedules"
          icon={<Calendar className="w-6 h-6" />}
        />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Appointments" 
        description="Manage patient appointments and schedules"
        icon={<Calendar className="w-6 h-6" />}
      >
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={fetchAppointments}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleNewAppointment}>
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </PageHeader>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="list">
            <List className="h-4 w-4 mr-2" />
            All Appointments
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-4">
          <CalendarView appointments={appointments} onAppointmentClick={handleAppointmentClick} />
        </TabsContent>
        
        <TabsContent value="list" className="space-y-4">
          <AppointmentsList 
            appointments={appointments} 
            onUpdate={fetchAppointments}
            onView={handleAppointmentClick}
          />
        </TabsContent>
      </Tabs>

      <AppointmentModal
        appointment={selectedAppointment}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        mode={modalMode}
      />
    </div>
  )
}
