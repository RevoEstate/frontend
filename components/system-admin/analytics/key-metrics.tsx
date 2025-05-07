"use client"

import { ArrowDown, ArrowUp, Building2, CreditCard, Home, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function KeyMetrics() {
  // Mock data - in a real app, you would fetch this from an API
  const metrics = [
    {
      title: "Total Users",
      value: "12,486",
      change: "+12.3%",
      trend: "up",
      description: "vs. previous period",
      icon: Users,
      breakdown: [
        { label: "Customers", value: "10,254" },
        { label: "Real Estates", value: "1,872" },
        { label: "Managers", value: "360" },
      ],
    },
    {
      title: "Property Listings",
      value: "8,642",
      change: "+5.7%",
      trend: "up",
      description: "vs. previous period",
      icon: Home,
      breakdown: [
        { label: "New", value: "1,245" },
        { label: "Active", value: "6,872" },
        { label: "Sold/Rented", value: "525" },
      ],
    },
    {
      title: "Appointment Bookings",
      value: "3,845",
      change: "-2.5%",
      trend: "down",
      description: "vs. previous period",
      icon: Building2,
      breakdown: [
        { label: "Total", value: "3,845" },
        { label: "Completed", value: "2,756" },
        { label: "Canceled", value: "1,089" },
      ],
    },
    {
      title: "Payment Transactions",
      value: "$245,872",
      change: "+8.2%",
      trend: "up",
      description: "vs. previous period",
      icon: CreditCard,
      breakdown: [
        { label: "Total Revenue", value: "$245,872" },
        { label: "Pending", value: "$18,450" },
      ],
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <CardDescription>{metric.description}</CardDescription>
            </div>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="flex items-center mt-1">
              {metric.trend === "up" ? (
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={metric.trend === "up" ? "text-green-500" : "text-red-500"}>{metric.change}</span>
            </div>
            <div className="mt-4 space-y-2">
              {metric.breakdown.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
