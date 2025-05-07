"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"

export function PropertyTypeChart() {
  // Mock data - in a real app, you would fetch this from an API
  const data = [
    { name: "House", value: 45, color: "#3b82f6" },
    { name: "Apartment", value: 30, color: "#10b981" },
    { name: "Condo", value: 15, color: "#f59e0b" },
    { name: "Commercial", value: 10, color: "#6366f1" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listings by Property Type</CardTitle>
        <CardDescription>Distribution of property listings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}%`, "Percentage"]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
