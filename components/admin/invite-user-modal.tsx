"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Mail, User, Shield } from "lucide-react"

interface InviteUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onInvite: (userData: { email: string; name: string; role: string }) => void
}

export function InviteUserModal({ open, onOpenChange, onInvite }: InviteUserModalProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState("member")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    await onInvite({
      email: email.trim(),
      name: name.trim() || email.split("@")[0],
      role,
    })
    setLoading(false)

    // Reset form
    setEmail("")
    setName("")
    setRole("clinic_member")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
              <UserPlus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">Invite New User</DialogTitle>
              <DialogDescription className="text-base">
                Send an invitation to a new user to join your dental practice.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name (Optional)
              </Label>
              <Input 
                id="name" 
                placeholder="Enter full name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="h-11"
              />
              <p className="text-xs text-gray-500">If left empty, we'll use the email prefix</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Role & Permissions
              </Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clinic_member">
                    <div className="flex flex-col">
                      <span className="font-medium">Clinic Member</span>
                      <span className="text-xs text-gray-500">Basic access to inventory, appointments, and orders</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="clinic_admin">
                    <div className="flex flex-col">
                      <span className="font-medium">Clinic Administrator</span>
                      <span className="text-xs text-gray-500">Complete system access and user management</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !email.trim()}
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Send Invitation
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
