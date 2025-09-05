"use client"

import { AdminRoute } from "@/lib/auth"
import { PageHeader } from "@/components/page-header"
import { UserManagement } from "@/components/admin/user-management"

export default function AdminPage() {
  return (
    <AdminRoute>
      <div className="space-y-6">
        <PageHeader title="Admin Panel" description="Manage users, roles, and system settings" />
        <UserManagement />
      </div>
    </AdminRoute>
  )
}
