"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  UserPlus, 
  Settings, 
  Shield, 
  Activity,
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react"

interface AdminStats {
  totalUsers: number
  activeUsers: number
  pendingInvites: number
  recentActivity: number
}

interface AdminDashboardProps {
  stats: AdminStats
  onInviteUser: () => void
  onManageSettings: () => void
}

export function AdminDashboard({ stats, onInviteUser, onManageSettings }: AdminDashboardProps) {
  const quickActions = [
    {
      title: "Invite User",
      description: "Add new team members",
      icon: UserPlus,
      action: onInviteUser,
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "System Settings",
      description: "Configure preferences",
      icon: Settings,
      action: onManageSettings,
      color: "bg-gray-500 hover:bg-gray-600"
    },
    {
      title: "Security",
      description: "Manage permissions",
      icon: Shield,
      action: () => {},
      color: "bg-red-500 hover:bg-red-600"
    }
  ]

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
      changeType: "positive" as const
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+8%",
      changeType: "positive" as const
    },
    {
      title: "Pending Invites",
      value: stats.pendingInvites,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      change: "-3%",
      changeType: "negative" as const
    },
    {
      title: "Recent Activity",
      value: stats.recentActivity,
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+15%",
      changeType: "positive" as const
    }
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <Badge 
                      variant={stat.changeType === "positive" ? "default" : "secondary"}
                      className={`text-xs ${
                        stat.changeType === "positive" 
                          ? "bg-green-100 text-green-800 hover:bg-green-100" 
                          : "bg-red-100 text-red-800 hover:bg-red-100"
                      }`}
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change}
                    </Badge>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common administrative tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-6 flex flex-col items-start gap-3 hover:shadow-md transition-all duration-200 border-2 hover:border-blue-200"
                onClick={action.action}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`p-2 rounded-lg text-white ${action.color}`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
