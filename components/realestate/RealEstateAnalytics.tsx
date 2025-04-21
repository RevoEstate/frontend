"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Home, DollarSign, TrendingUp, Users } from "lucide-react"

// Real estate specific data
const propertyData = [
  { month: "Jan", listed: 24, sold: 18 },
  { month: "Feb", listed: 32, sold: 22 },
  { month: "Mar", listed: 28, sold: 25 },
  { month: "Apr", listed: 41, sold: 32 },
  { month: "May", listed: 36, sold: 28 },
  { month: "Jun", listed: 45, sold: 38 },
]

const chartConfig = {
  listed: {
    label: "Properties Listed",
    color: "#3b82f6", // blue-500
  },
  sold: {
    label: "Properties Sold",
    color: "#10b981", // emerald-500
  },
} satisfies ChartConfig

const stats = [
  {
    title: "Total Properties",
    value: "142",
    change: "+12% from last month",
    icon: <Home className="h-6 w-6" />,
  },
  {
    title: "Total Value",
    value: "$42.8M",
    change: "+8% from last month",
    icon: <DollarSign className="h-6 w-6" />,
  },
  {
    title: "Avg. Days on Market",
    value: "27",
    change: "-5% from last month",
    icon: <TrendingUp className="h-6 w-6" />,
  },
  {
    title: "Active Clients",
    value: "84",
    change: "+15% from last month",
    icon: <Users className="h-6 w-6" />,
  },
]

export function RealEstateAnalytics() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className="text-muted-foreground">{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Property Listings vs Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Property Listings & Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={propertyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                  />
                  <YAxis 
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar 
                    dataKey="listed" 
                    fill="var(--color-listed)" 
                    radius={[4, 4, 0, 0]} 
                  />
                  <Bar 
                    dataKey="sold" 
                    fill="var(--color-sold)" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Neighborhoods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Downtown", sales: 24, value: "$12.4M" },
                { name: "Riverside", sales: 18, value: "$9.2M" },
                { name: "Hillside", sales: 15, value: "$8.7M" },
                { name: "West End", sales: 12, value: "$6.3M" },
              ].map((area, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{area.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {area.sales} sales
                    </p>
                  </div>
                  <div className="font-medium">{area.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Price Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { range: "$0 - $500K", count: 42, percentage: "35%" },
                { range: "$500K - $1M", count: 28, percentage: "23%" },
                { range: "$1M - $2M", count: 24, percentage: "20%" },
                { range: "$2M+", count: 12, percentage: "10%" },
              ].map((price, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{price.range}</span>
                    <span>{price.percentage}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: price.percentage }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}