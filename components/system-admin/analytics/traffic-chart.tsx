"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function TrafficChart() {
  // Mock data - in a real app, you would fetch this from an API
  const data = [
    { day: "Mon", visitors: 2400 },
    { day: "Tue", visitors: 1398 },
    { day: "Wed", visitors: 3800 },
    { day: "Thu", visitors: 3908 },
    { day: "Fri", visitors: 4800 },
    { day: "Sat", visitors: 3800 },
    { day: "Sun", visitors: 4300 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Platform Traffic</CardTitle>
        <CardDescription>Unique visitors per day</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                }}
                formatter={(value) => [`${value} visitors`, "Traffic"]}
              />
              <Line type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
