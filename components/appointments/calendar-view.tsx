"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar, Clock, User, Phone } from "lucide-react"

interface Appointment {
  id: number
  patientName: string
  patientEmail: string
  patientPhone: string
  date: string
  time: string
  duration: number
  type: string
  status: string
  notes: string
}

interface CalendarViewProps {
  appointments: Appointment[]
  onAppointmentClick: (appointment: Appointment) => void
}

export function CalendarView({ appointments, onAppointmentClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month")
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const formatTime = (time: string) => {
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getEndTime = (time: string, duration: number) => {
    const [hours, minutes] = time.split(':')
    const startMinutes = parseInt(hours) * 60 + parseInt(minutes)
    const endMinutes = startMinutes + duration
    const endHour = Math.floor(endMinutes / 60)
    const endMin = endMinutes % 60
    return formatTime(`${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`)
  }

  const getAppointmentsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return appointments
      .filter((apt) => apt.date === dateStr)
      .sort((a, b) => a.time.localeCompare(b.time)) // Sort by time
  }

  const getAppointmentsForSelectedDay = () => {
    if (selectedDay === null) return []
    return getAppointmentsForDate(selectedDay)
  }

  const handleDayClick = (day: number) => {
    setSelectedDay(day)
    setViewMode("day")
  }

  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push(timeStr)
      }
    }
    return slots
  }

  const getAppointmentsForTimeSlot = (timeSlot: string) => {
    const dayAppointments = getAppointmentsForSelectedDay()
    return dayAppointments.filter(apt => apt.time === timeSlot)
  }

  const isTimeSlotOccupied = (timeSlot: string) => {
    return getAppointmentsForTimeSlot(timeSlot).length > 0
  }

  const getMaxConcurrentAppointments = () => {
    const dayAppointments = getAppointmentsForSelectedDay()
    const timeSlotCounts: { [key: string]: number } = {}
    
    dayAppointments.forEach(apt => {
      timeSlotCounts[apt.time] = (timeSlotCounts[apt.time] || 0) + 1
    })
    
    return Math.max(...Object.values(timeSlotCounts), 1)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "confirmed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "cleaning":
        return "bg-blue-50 text-blue-700"
      case "checkup":
        return "bg-green-50 text-green-700"
      case "treatment":
        return "bg-orange-50 text-orange-700"
      case "emergency":
        return "bg-red-50 text-red-700"
      default:
        return "bg-gray-50 text-gray-700"
    }
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i)

  // Day View Component
  const DayView = () => {
    if (selectedDay === null) return null

    const dayAppointments = getAppointmentsForSelectedDay()
    const timeSlots = generateTimeSlots()
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay)
    const dayName = selectedDate.toLocaleDateString("en-US", { weekday: "long" })
    const dayDate = selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    const maxConcurrent = getMaxConcurrentAppointments()

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>{dayName}, {dayDate}</span>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {dayAppointments.length} appointment{dayAppointments.length !== 1 ? 's' : ''} scheduled
                {maxConcurrent > 1 && ` • Up to ${maxConcurrent} concurrent appointments`}
              </p>
            </div>
            <Button variant="outline" onClick={() => setViewMode("month")}>
              Back to Month
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Time Slots */}
          <div className="space-y-2">
            {timeSlots.map((timeSlot) => {
              const appointments = getAppointmentsForTimeSlot(timeSlot)
              const isOccupied = isTimeSlotOccupied(timeSlot)
              
              return (
                <div
                  key={timeSlot}
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  {/* Time Column */}
                  <div className="w-20 flex-shrink-0">
                    <div className="text-sm font-medium text-gray-600">
                      {formatTime(timeSlot)}
                    </div>
                  </div>

                  {/* Appointments Grid */}
                  <div className="flex-1">
                    {appointments.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                        {appointments.map((appointment, index) => (
                          <div
                            key={appointment.id}
                            className={`p-3 rounded-lg border cursor-pointer hover:shadow-md transition-all ${getStatusColor(appointment.status)}`}
                            onClick={() => onAppointmentClick(appointment)}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <User className="w-4 h-4 text-gray-600" />
                              <div className="font-medium text-gray-900 truncate">
                                {appointment.patientName}
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              {appointment.type}
                            </div>
                            <div className="flex items-center justify-between">
                              <Badge className={`text-xs ${getTypeColor(appointment.type)}`}>
                                {appointment.duration}min
                              </Badge>
                              <Badge className={`text-xs ${getStatusColor(appointment.status)}`}>
                                {appointment.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* View Mode Toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Appointments Calendar</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === "month" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("month")}
                  className="h-8"
                >
                  Month
                </Button>
                <Button
                  variant={viewMode === "week" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("week")}
                  className="h-8"
                >
                  Week
                </Button>
                <Button
                  variant={viewMode === "day" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("day")}
                  className="h-8"
                >
                  Day
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium min-w-[200px] text-center">{formatDate(currentDate)}</span>
                <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Day View */}
      {viewMode === "day" && <DayView />}

      {/* Calendar Grid - Only show in month view */}
      {viewMode === "month" && (
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-7 gap-1 p-4 border-b">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 p-4">
              {emptyDays.map((_, index) => (
                <div key={`empty-${index}`} className="h-32 p-1" />
              ))}
              {days.map((day) => {
                const dayAppointments = getAppointmentsForDate(day)
                const isToday =
                  day === new Date().getDate() &&
                  currentDate.getMonth() === new Date().getMonth() &&
                  currentDate.getFullYear() === new Date().getFullYear()

                return (
                  <div
                    key={day}
                    className={`h-32 p-1 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                      isToday ? "bg-blue-50 border-blue-300" : "bg-white"
                    } ${selectedDay === day ? "ring-2 ring-blue-500" : ""}`}
                    onClick={() => handleDayClick(day)}
                  >
                    <div className="text-sm font-medium text-gray-900 mb-1">{day}</div>
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                      {dayAppointments.slice(0, 2).map((appointment) => (
                        <div
                          key={appointment.id}
                          className={`text-xs p-2 rounded cursor-pointer hover:shadow-sm transition-all border ${getStatusColor(appointment.status)}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            onAppointmentClick(appointment)
                          }}
                        >
                          <div className="flex items-center gap-1 mb-1">
                            <Clock className="w-3 h-3" />
                            <span className="font-medium">
                              {formatTime(appointment.time)} - {getEndTime(appointment.time, appointment.duration)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mb-1">
                            <User className="w-3 h-3" />
                            <span className="truncate font-medium">{appointment.patientName}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge className={`text-xs ${getTypeColor(appointment.type)}`}>
                              {appointment.type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {appointment.duration}min
                            </Badge>
                          </div>
                        </div>
                      ))}
                      {dayAppointments.length > 2 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{dayAppointments.length - 2} more
                        </div>
                      )}
                      {dayAppointments.length === 0 && (
                        <div className="text-xs text-gray-400 text-center mt-2">Click to view day</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Status Legend:</span>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
                <Badge className="bg-green-100 text-green-800">Completed</Badge>
                <Badge className="bg-emerald-100 text-emerald-800">Confirmed</Badge>
                <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Types:</span>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-50 text-blue-700">Cleaning</Badge>
                <Badge className="bg-green-50 text-green-700">Checkup</Badge>
                <Badge className="bg-orange-50 text-orange-700">Treatment</Badge>
                <Badge className="bg-red-50 text-red-700">Emergency</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
