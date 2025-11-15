"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Users, Calendar, Package, BarChart3, CheckCircle, Star, Zap } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Redirect logged-in users to their appropriate dashboard
  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === "supplier") {
        router.push("/supplier/dashboard")
      } else {
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, router])

  const features = [
    {
      icon: Package,
      title: "Smart Inventory Management",
      description: "Track dental supplies, set low-stock alerts, and manage orders efficiently.",
    },
    {
      icon: Calendar,
      title: "Appointment Scheduling",
      description: "Streamlined calendar system for managing patient appointments and schedules.",
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Invite team members, assign roles, and manage practice permissions.",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Comprehensive insights into your practice performance and metrics.",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "HIPAA-compliant platform ensuring patient data security and privacy.",
    },
    {
      icon: CheckCircle,
      title: "Easy Integration",
      description: "Seamlessly integrate with existing dental practice management systems.",
    },
  ]

  return (
    <div className="min-h-screen bg-white relative">
      {/* Grid Background Pattern - Primary */}
      <div className="absolute inset-0 grid-pattern-primary bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Grid Background Pattern - Secondary */}
      <div className="absolute inset-0 grid-pattern-secondary bg-[size:1.5rem_1.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Decorative Blur Circles */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="hidden font-bold sm:inline-block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dentura
              </span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <Button variant="ghost" className="md:hidden">
                <span className="sr-only">Toggle menu</span>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                </svg>
              </Button>
            </div>
            <nav className="flex items-center space-x-2">
              <Link href="/signup">
                <Button variant="outline" className="border-border/40 bg-background/80 backdrop-blur-sm">
                  Sign Up
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Hero Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 animate-gradient-shift" />
        
        {/* Hero Grid Pattern - Primary */}
        <div className="absolute inset-0 grid-pattern-primary [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        
        {/* Hero Grid Pattern - Secondary */}
        <div className="absolute inset-0 grid-pattern-secondary [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        
        {/* Hero Grid Pattern - Fine */}
        <div className="absolute inset-0 grid-pattern-fine [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        
        {/* Hero Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-400/20 rounded-full blur-2xl animate-blob animation-delay-2000" />
        <div className="absolute top-60 left-1/3 w-28 h-28 bg-purple-400/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
        <div className="absolute bottom-32 right-1/4 w-20 h-20 bg-pink-400/20 rounded-full blur-2xl animate-blob animation-delay-1000" />
        <div className="absolute bottom-20 left-1/2 w-36 h-36 bg-cyan-400/20 rounded-full blur-3xl animate-blob animation-delay-3000" />
        
        {/* Additional Bubbles */}
        <div className="absolute top-10 right-1/3 w-16 h-16 bg-indigo-400/20 rounded-full blur-2xl animate-blob animation-delay-500" />
        <div className="absolute top-80 left-1/4 w-22 h-22 bg-emerald-400/20 rounded-full blur-3xl animate-blob animation-delay-1500" />
        <div className="absolute top-1/2 right-10 w-26 h-26 bg-rose-400/20 rounded-full blur-2xl animate-blob animation-delay-2500" />
        <div className="absolute bottom-40 left-1/5 w-18 h-18 bg-violet-400/20 rounded-full blur-3xl animate-blob animation-delay-3500" />
        <div className="absolute top-1/3 left-1/6 w-30 h-30 bg-teal-400/20 rounded-full blur-3xl animate-blob animation-delay-4500" />
        <div className="absolute bottom-10 right-1/3 w-14 h-14 bg-orange-400/20 rounded-full blur-3xl animate-blob animation-delay-5500" />
        <div className="absolute top-2/3 left-2/3 w-24 h-24 bg-lime-400/20 rounded-full blur-2xl animate-blob animation-delay-6500" />
        <div className="absolute top-1/4 right-1/5 w-20 h-20 bg-sky-400/20 rounded-full blur-3xl animate-blob animation-delay-7500" />
        <div className="absolute bottom-1/3 right-1/6 w-28 h-28 bg-fuchsia-400/20 rounded-full blur-2xl animate-blob animation-delay-8500" />
        <div className="absolute top-3/4 left-1/2 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl animate-blob animation-delay-9500" />
        <div className="absolute top-1/6 left-1/8 w-16 h-16 bg-slate-400/20 rounded-full blur-2xl animate-blob animation-delay-10500" />
        <div className="absolute bottom-1/4 left-3/4 w-22 h-22 bg-stone-400/20 rounded-full blur-3xl animate-blob animation-delay-11500" />
        <div className="absolute top-5/6 right-1/8 w-18 h-18 bg-zinc-400/20 rounded-full blur-2xl animate-blob animation-delay-12500" />
        <div className="absolute top-1/5 right-2/3 w-26 h-26 bg-neutral-400/20 rounded-full blur-3xl animate-blob animation-delay-13500" />
        <div className="absolute bottom-1/6 left-1/3 w-20 h-20 bg-gray-400/20 rounded-full blur-2xl animate-blob animation-delay-14500" />
        
        {/* Floating Particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-500/30 dark:bg-blue-400/20 rounded-full animate-float" />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-purple-500/30 dark:bg-purple-400/20 rounded-full animate-float animation-delay-2000" />
        <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-cyan-500/30 dark:bg-cyan-400/20 rounded-full animate-float animation-delay-4000" />
        <div className="absolute top-2/3 right-1/4 w-2.5 h-2.5 bg-blue-500/20 dark:bg-blue-400/10 rounded-full animate-float animation-delay-1000" />
        
        {/* Hero Content */}
        <div className="relative z-10 space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              Smart Dental
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Practice Management
              </span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Streamline your dental practice with intelligent inventory management, appointment scheduling, and team
              collaboration tools designed for modern dentistry.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://github.com/connect-abdulbasit/Dental-Inventory-Management-System" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-border/40 bg-background/80 backdrop-blur-sm">
                  <Star className="mr-2 h-4 w-4" />
                  Star on GitHub
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container space-y-6 py-8 md:py-12 lg:py-24 relative z-10">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Everything You Need
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Comprehensive tools designed specifically for dental practices to improve efficiency and patient care.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="relative overflow-hidden rounded-lg border bg-background p-2 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-8 md:py-12 lg:py-24 relative z-10">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Ready to Transform Your Practice?
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Join hundreds of dental practices already using Dentura to streamline their operations and improve patient care.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="https://github.com/connect-abdulbasit/Dental-Inventory-Management-System" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-border/40">
                <Star className="mr-2 h-4 w-4" />
                Star on GitHub
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">D</span>
              </div>
              <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                Built by{" "}
                <span className="font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Dentura
                </span>
                . The source code is available on{" "}
                <a
                  href="https://github.com/connect-abdulbasit/Dental-Inventory-Management-System"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline underline-offset-4"
                >
                  GitHub
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
