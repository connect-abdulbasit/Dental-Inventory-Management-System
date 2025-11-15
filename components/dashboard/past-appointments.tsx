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

  // Filter out completed and cancelled appointments, and only get past appointments
  const now = new Date()
  const pendingPastAppointments = appointments
    .filter((apt) => apt.status === "scheduled")
    .filter((apt) => {
      const aptDate = new Date(`${apt.date}T${apt.time}`)
      return aptDate < now
    })
    .sort((a, b) => {
      // Sort by date/time descending (most recent first)
      const dateA = new Date(`${a.date}T${a.time}`).getTime()
      const dateB = new Date(`${b.date}T${b.time}`).getTime()
      return dateB - dateA
    })
    .slice(0, 3) // Only show 3 latest

  if (pendingPastAppointments.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <Calendar className="h-4 w-4 text-blue-600" />
            Recent Past Appointments
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-center py-4">
            <CheckCircle2 className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600">All caught up!</p>
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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Calendar className="h-4 w-4" />
          Recent Past Appointments
          <Badge variant="outline" className="ml-auto text-xs">
            {pendingPastAppointments.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {pendingPastAppointments.map((appointment) => {
            const { dateStr, timeStr } = formatDateTime(
              appointment.date,
              appointment.time
            )

            const isUpdating = updatingId === appointment.id

            return (
              <div
                key={appointment.id}
                className="border rounded-lg p-2.5 bg-white hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <User className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
                      <span className="font-semibold text-gray-900 text-sm truncate">
                        {appointment.patientName}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-gray-400 flex-shrink-0" />
                        <span>{dateStr}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-gray-400 flex-shrink-0" />
                        <span>
                          {timeStr} • {appointment.duration} min
                        </span>
                      </div>
                      <div>
                        <Badge variant="outline" className="text-xs py-0 px-1.5 h-5">
                          {appointment.procedureName || appointment.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <Button
                    size="sm"
                    className="flex-1 h-7 text-xs bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleStatusUpdate(appointment.id, "completed")}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                    )}
                    Complete
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1 h-7 text-xs"
                    onClick={() => handleStatusUpdate(appointment.id, "cancelled")}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
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

