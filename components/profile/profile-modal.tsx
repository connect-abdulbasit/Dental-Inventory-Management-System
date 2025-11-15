"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function ProfileModal({ isOpen, onClose, onSuccess }: ProfileModalProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    storeName: "",
    clinicName: "",
    clinicAddress: "",
    clinicPhone: "",
  })

  useEffect(() => {
    if (isOpen && user) {
      // Initialize form with current user data
      setFormData({
        name: user.name || "",
        phone: (user as any).phone || "",
        storeName: (user as any).storeName || "",
        clinicName: (user as any).clinicName || "",
        clinicAddress: (user as any).clinicAddress || "",
        clinicPhone: (user as any).clinicPhone || "",
      })
    }
  }, [isOpen, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsLoading(true)
    try {
      const updateData: any = {
        name: formData.name,
        phone: formData.phone,
      }

      // Add supplier-specific fields
      if (user?.role === "supplier") {
        updateData.storeName = formData.storeName
      }

      // Add admin-specific fields
      if (user?.role === "clinic_admin") {
        updateData.clinicName = formData.clinicName
        updateData.clinicAddress = formData.clinicAddress
        updateData.clinicPhone = formData.clinicPhone
      }

      // In production, this would call /api/users/[id] or /api/profile
      const response = await fetch(`/api/users/${user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
        onSuccess?.()
        onClose()
        // Refresh the page to update user data
        window.location.reload()
      } else {
        throw new Error(result.error || "Failed to update profile")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  const isSupplier = user.role === "supplier"
  const isAdmin = user.role === "clinic_admin"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your personal information. Email cannot be changed.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Email (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user.email}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your full name"
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+92 300 1234567"
                required
              />
            </div>

            {/* Supplier-specific: Store Name */}
            {isSupplier && (
              <div className="space-y-2">
                <Label htmlFor="storeName">
                  Store Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="storeName"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  placeholder="Your store/business name"
                  required
                />
              </div>
            )}

            {/* Admin-specific: Clinic Information */}
            {isAdmin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="clinicName">
                    Clinic Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="clinicName"
                    value={formData.clinicName}
                    onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                    placeholder="Clinic name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clinicAddress">Clinic Address</Label>
                  <Input
                    id="clinicAddress"
                    value={formData.clinicAddress}
                    onChange={(e) => setFormData({ ...formData, clinicAddress: e.target.value })}
                    placeholder="Street address, City"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clinicPhone">Clinic Phone Number</Label>
                  <Input
                    id="clinicPhone"
                    value={formData.clinicPhone}
                    onChange={(e) => setFormData({ ...formData, clinicPhone: e.target.value })}
                    placeholder="+92 300 1234567"
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

