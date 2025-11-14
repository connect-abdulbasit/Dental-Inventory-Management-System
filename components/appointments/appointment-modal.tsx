"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, User, Phone, Mail, FileText, CheckCircle, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Procedure {
  id: number
  name: string
  items: Array<{
    inventoryItemId: number
    inventoryItemName: string
    quantity: number
  }>
}

interface Appointment {
  id?: number
  patientName: string
  patientEmail: string
  patientPhone: string
  date: string
  time: string
  duration: number
  procedureId?: number
  procedureName?: string
  type?: string // Keep for backward compatibility
  status: string
  notes: string
}

interface AppointmentModalProps {
  appointment: Appointment | null
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  mode: "view" | "edit" | "create"
}

export function AppointmentModal({ appointment, isOpen, onClose, onSave, mode }: AppointmentModalProps) {
  const [formData, setFormData] = useState<Appointment>({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    date: "",
    time: "",
    duration: 60,
    procedureId: undefined,
    procedureName: "",
    status: "scheduled",
    notes: "",
  })
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [isLoadingProcedures, setIsLoadingProcedures] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchProcedures = async () => {
    setIsLoadingProcedures(true)
    try {
      const response = await fetch("/api/procedures")
      const data = await response.json()
      setProcedures(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load procedures.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingProcedures(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchProcedures()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  useEffect(() => {
    if (appointment) {
      setFormData(appointment)
    } else {
      setFormData({
        patientName: "",
        patientEmail: "",
        patientPhone: "",
        date: "",
        time: "",
        duration: 60,
        procedureId: undefined,
        procedureName: "",
        status: "scheduled",
        notes: "",
      })
    }
  }, [appointment])

  const handleSave = async () => {
    // Validation
    if (!formData.procedureId) {
      toast({
        title: "Validation error",
        description: "Please select a procedure for this appointment.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      let response
      if (mode === "create") {
        response = await fetch("/api/appointments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            // Keep type for backward compatibility, but use procedureName
            type: formData.procedureName || formData.type,
          }),
        })
      } else if (mode === "edit" && appointment?.id) {
        response = await fetch(`/api/appointments/${appointment.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            type: formData.procedureName || formData.type,
          }),
        })
      }

      if (response) {
        const result = await response.json()
        if (result.success) {
          toast({
            title: "Success",
            description: result.message,
          })
          onSave()
          onClose()
        } else {
          throw new Error(result.error || "Failed to save appointment")
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save appointment",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleComplete = async () => {
    if (!appointment?.id) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/appointments/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: appointment.id,
          notes: formData.notes,
        }),
      })

      const result = await response.json()
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        onSave()
        onClose()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete appointment",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!appointment?.id) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/appointments/${appointment.id}`, {
        method: "DELETE",
      })

      const result = await response.json()
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        onSave()
        onClose()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete appointment",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      scheduled: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    }
    return <Badge className={colors[status as keyof typeof colors] || colors.scheduled}>{status}</Badge>
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "New Appointment" : mode === "edit" ? "Edit Appointment" : "Appointment Details"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Schedule a new appointment"
              : mode === "edit"
                ? "Update appointment information"
                : "View appointment details"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {mode === "view" && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Status:</span>
                {getStatusBadge(formData.status)}
              </div>
              {appointment?.id && <span className="text-sm text-gray-500">ID: #{appointment.id}</span>}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patientName" className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>Patient Name</span>
              </Label>
              <Input
                id="patientName"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                disabled={mode === "view"}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="patientEmail" className="flex items-center space-x-1">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </Label>
              <Input
                id="patientEmail"
                type="email"
                value={formData.patientEmail}
                onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
                disabled={mode === "view"}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patientPhone" className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>Phone</span>
              </Label>
              <Input
                id="patientPhone"
                value={formData.patientPhone}
                onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                disabled={mode === "view"}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="procedureId">
                Procedure <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.procedureId?.toString() || ""}
                onValueChange={(value) => {
                  const selectedProcedure = procedures.find((p) => p.id === Number.parseInt(value))
                  setFormData({
                    ...formData,
                    procedureId: Number.parseInt(value),
                    procedureName: selectedProcedure?.name || "",
                  })
                }}
                disabled={mode === "view" || isLoadingProcedures}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={isLoadingProcedures ? "Loading..." : "Select procedure"} />
                </SelectTrigger>
                <SelectContent>
                  {procedures.length === 0 ? (
                    <SelectItem value="none" disabled>
                      {isLoadingProcedures ? "Loading procedures..." : "No procedures available"}
                    </SelectItem>
                  ) : (
                    procedures.map((procedure) => (
                      <SelectItem key={procedure.id} value={procedure.id.toString()}>
                        {procedure.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {procedures.length === 0 && !isLoadingProcedures && (
                <p className="text-xs text-gray-500 mt-1">
                  Create procedures in the Procedures section first
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date" className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Date</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                disabled={mode === "view"}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="time" className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Time</span>
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                disabled={mode === "view"}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) })}
                disabled={mode === "view"}
                className="mt-1"
                min="15"
                step="15"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes" className="flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>Notes</span>
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              disabled={mode === "view"}
              className="mt-1"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex space-x-2">
            {mode === "view" && appointment?.status === "scheduled" && (
              <>
                <Button variant="outline" onClick={handleComplete} disabled={isLoading}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {mode !== "view" && (
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : mode === "create" ? "Create" : "Update"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
