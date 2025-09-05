"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"

interface LowStockItem {
  name: string
  quantity: number
  threshold: number
}

interface LowStockAlertsProps {
  items: LowStockItem[]
}

export function LowStockAlerts({ items }: LowStockAlertsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <span>Low Stock Alerts</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
            >
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">
                  {item.quantity} remaining (threshold: {item.threshold})
                </p>
              </div>
              <Badge variant="destructive">Low Stock</Badge>
            </div>
          ))}
          {items.length === 0 && <p className="text-gray-500 text-center py-4">No low stock alerts</p>}
        </div>
      </CardContent>
    </Card>
  )
}
