"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { UserManagement } from "@/components/admin/user-management"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Users, CreditCard } from "lucide-react"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users")

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Admin Panel" 
        description="Manage users and payment settings for your dental practice"
        icon={<Settings className="w-6 h-6" />}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Payment Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <PaymentManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Payment Management Component
function PaymentManagement() {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: "1",
      type: "Credit Card",
      last4: "4242",
      brand: "Visa",
      expiryMonth: "12",
      expiryYear: "2025",
      isDefault: true,
      status: "active"
    },
    {
      id: "2", 
      type: "Credit Card",
      last4: "5555",
      brand: "Mastercard",
      expiryMonth: "08",
      expiryYear: "2026",
      isDefault: false,
      status: "active"
    },
    {
      id: "3",
      type: "Bank Account",
      last4: "1234",
      bankName: "Chase Bank",
      accountType: "Checking",
      isDefault: false,
      status: "active"
    }
  ])

  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: "credit_card",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardholderName: "",
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    accountType: "checking"
  })

  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddPaymentMethod = () => {
    // Mock implementation
    console.log("Adding payment method:", newPaymentMethod)
    setShowAddForm(false)
    setNewPaymentMethod({
      type: "credit_card",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      cardholderName: "",
      bankName: "",
      accountNumber: "",
      routingNumber: "",
      accountType: "checking"
    })
  }

  const handleSetDefault = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    )
  }

  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
          <p className="text-gray-600 mt-1">Manage payment methods and billing settings</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <CreditCard className="w-4 h-4 mr-2" />
          Add Payment Method
        </Button>
      </div>

      {/* Payment Methods List */}
      <div className="grid gap-4">
        {paymentMethods.map((method) => (
          <div key={method.id} className="border rounded-lg p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {method.type === "Credit Card" ? `${method.brand} •••• ${method.last4}` : `${method.bankName} •••• ${method.last4}`}
                    </h3>
                    {method.isDefault && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {method.type === "Credit Card" 
                      ? `Expires ${method.expiryMonth}/${method.expiryYear}`
                      : `${method.accountType} account`
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!method.isDefault && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSetDefault(method.id)}
                  >
                    Set Default
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeletePaymentMethod(method.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Payment Method Form */}
      {showAddForm && (
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Add New Payment Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type</label>
              <select 
                value={newPaymentMethod.type}
                onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, type: e.target.value }))}
                className="w-full p-2 border rounded-md"
              >
                <option value="credit_card">Credit Card</option>
                <option value="bank_account">Bank Account</option>
              </select>
            </div>
            
            {newPaymentMethod.type === "credit_card" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                  <input 
                    type="text" 
                    placeholder="1234 5678 9012 3456"
                    value={newPaymentMethod.cardNumber}
                    onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, cardNumber: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    value={newPaymentMethod.cardholderName}
                    onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, cardholderName: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Month</label>
                  <input 
                    type="text" 
                    placeholder="12"
                    value={newPaymentMethod.expiryMonth}
                    onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, expiryMonth: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Year</label>
                  <input 
                    type="text" 
                    placeholder="2025"
                    value={newPaymentMethod.expiryYear}
                    onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, expiryYear: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                  <input 
                    type="text" 
                    placeholder="Chase Bank"
                    value={newPaymentMethod.bankName}
                    onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, bankName: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                  <input 
                    type="text" 
                    placeholder="1234567890"
                    value={newPaymentMethod.accountNumber}
                    onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, accountNumber: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Routing Number</label>
                  <input 
                    type="text" 
                    placeholder="021000021"
                    value={newPaymentMethod.routingNumber}
                    onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, routingNumber: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                  <select 
                    value={newPaymentMethod.accountType}
                    onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, accountType: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                  </select>
                </div>
              </>
            )}
          </div>
          <div className="flex gap-3 mt-6">
            <Button onClick={handleAddPaymentMethod}>
              Add Payment Method
            </Button>
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
