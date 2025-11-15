"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

interface PastAppointmentsProps {
  appointments: Appointment[]
  onUpdate: () => void
}

export function PastAppointments({ appointments, onUpdate }: PastAppointmentsProps) {
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const { toast } = useToast()

  // Filter out completed and cancelled appointments
  const pendingAppointments = appointments.filter(
    (apt) => apt.status === "scheduled"
  )

  if (pendingAppointments.length === 0) {
    return (
      <Card className="border-2">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Calendar className="h-5 w-5 text-blue-600" />
            Past Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-3">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">All caught up!</p>
            <p className="text-xs text-gray-500 mt-1">No past appointments pending action</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleStatusUpdate = async (appointmentId: number, status: "completed" | "cancelled") => {
    setUpdatingId(appointmentId)
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      const result = await response.json()
      if (result.success) {
        toast({
          title: "Success",
          description: `Appointment marked as ${status}`,
        })
        onUpdate()
      } else {
        throw new Error(result.error || "Failed to update appointment")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update appointment status",
        variant: "destructive",
      })
    } finally {
      setUpdatingId(null)
    }
  }

  const formatDateTime = (date: string, time: string) => {
    const appointmentDate = new Date(`${date}T${time}`)
    const now = new Date()
    const isPast = appointmentDate < now

    return {
      dateStr: appointmentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      timeStr: appointmentDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      isPast,
    }
  }

  return (
    <Card className="border-2">
      <CardHeader className="bg-gradient-to-r">
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Calendar className="h-5 w-5" />
          Past Appointments
          <Badge className="ml-auto">
            {pendingAppointments.filter((apt) => {
              const aptDate = new Date(`${apt.date}T${apt.time}`)
              return aptDate < new Date()
            }).length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {pendingAppointments.map((appointment) => {
            const { dateStr, timeStr, isPast } = formatDateTime(
              appointment.date,
              appointment.time
            )

            // Only show past appointments
            if (!isPast) return null

            const isUpdating = updatingId === appointment.id

            return (
              <div
                key={appointment.id}
                className="border-2 rounded-xl p-4 space-y-3 bg-white hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded-full bg-blue-100">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-bold text-gray-900 text-base">
                        {appointment.patientName}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="h-4 w-4 text-red-500" />
                        <span className="font-medium">{dateStr}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="h-4 w-4 text-red-500" />
                        <span>
                          {timeStr} • <span className="font-medium">{appointment.duration} min</span>
                        </span>
                      </div>
                      <div>
                        <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-xs font-medium">
                          {appointment.procedureName || appointment.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {appointment.notes && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-sm text-gray-600 italic">
                      {appointment.notes}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-3 border-t-2 border-gray-100">
                  <Button
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm"
                    onClick={() => handleStatusUpdate(appointment.id, "completed")}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                    )}
                    Mark Completed
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm"
                    onClick={() => handleStatusUpdate(appointment.id, "cancelled")}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2" />
                    )}
                    Cancel
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

