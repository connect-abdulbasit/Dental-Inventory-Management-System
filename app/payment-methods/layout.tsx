import { Navbar } from "@/components/navbar"
import { ProtectedRoute } from "@/lib/auth"

export default function PaymentMethodsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}

