"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Clock, User, CheckCircle2, XCircle, Loader2, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

interface AppointmentsListProps {
  appointments: Appointment[]
  onUpdate: () => void
  onView: (appointment: Appointment) => void
}

export function AppointmentsList({ appointments, onUpdate, onView }: AppointmentsListProps) {
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const { toast } = useToast()

  const handleStatusUpdate = async (appointmentId: number, status: "completed" | "cancelled" | "scheduled") => {
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
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update appointment status",
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

  const getStatusBadge = (status: string) => {
    const colors = {
      scheduled: "bg-blue-100 text-blue-800 border-blue-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      confirmed: "bg-emerald-100 text-emerald-800 border-emerald-200",
    }
    return (
      <Badge className={colors[status as keyof typeof colors] || colors.scheduled}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  // Sort appointments by date/time (most recent first)
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`).getTime()
    const dateB = new Date(`${b.date}T${b.time}`).getTime()
    return dateB - dateA
  })

  if (sortedAppointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No appointments found</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          All Appointments
          <Badge variant="outline" className="ml-auto">
            {sortedAppointments.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Procedure</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAppointments.map((appointment) => {
                const { dateStr, timeStr, isPast } = formatDateTime(
                  appointment.date,
                  appointment.time
                )
                const isUpdating = updatingId === appointment.id
                const canMarkCompleted = isPast && appointment.status === "scheduled"

                return (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="font-medium">{appointment.patientName}</div>
                          <div className="text-sm text-gray-500">{appointment.patientEmail}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="font-medium">{dateStr}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {timeStr}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {appointment.procedureName || appointment.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{appointment.duration} min</TableCell>
                    <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onView(appointment)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {appointment.status === "scheduled" && (
                          <>
                            {canMarkCompleted && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleStatusUpdate(appointment.id, "completed")}
                                disabled={isUpdating}
                              >
                                {isUpdating ? (
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                )}
                                Complete
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusUpdate(appointment.id, "cancelled")}
                              disabled={isUpdating}
                            >
                              {isUpdating ? (
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              ) : (
                                <XCircle className="h-4 w-4 mr-1" />
                              )}
                              Cancel
                            </Button>
                          </>
                        )}
                        {appointment.status === "cancelled" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(appointment.id, "scheduled")}
                            disabled={isUpdating}
                          >
                            {isUpdating ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              "Reschedule"
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

