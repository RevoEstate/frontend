"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

export function RegistrationChart() {
  // Mock data - in a real app, you would fetch this from an API
  const data = [
    { month: "Jan", users: 120 },
    { month: "Feb", users: 145 },
    { month: "Mar", users: 168 },
    { month: "Apr", users: 190 },
    { month: "May", users: 210 },
    { month: "Jun", users: 245 },
    { month: "Jul", users: 278 },
    { month: "Aug", users: 305 },
    { month: "Sep", users: 342 },
    { month: "Oct", users: 375 },
    { month: "Nov", users: 410 },
    { month: "Dec", users: 458 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Registrations</CardTitle>
        <CardDescription>Monthly user registrations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                }}
                formatter={(value) => [`${value} users`, "Registrations"]}
              />
              <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
