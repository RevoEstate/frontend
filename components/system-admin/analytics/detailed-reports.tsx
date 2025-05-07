"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function DetailedReports() {
  const [activeTab, setActiveTab] = useState("user-activity")

  // Mock data - in a real app, you would fetch this from an API
  const userActivityData = [
    {
      user: "John Smith",
      email: "john@example.com",
      logins: 45,
      searches: 128,
      interactions: 67,
      lastActive: "2 hours ago",
    },
    {
      user: "Maria Johnson",
      email: "maria@example.com",
      logins: 32,
      searches: 94,
      interactions: 53,
      lastActive: "5 hours ago",
    },
    {
      user: "Robert Wilson",
      email: "robert@example.com",
      logins: 28,
      searches: 76,
      interactions: 41,
      lastActive: "1 day ago",
    },
    {
      user: "Emily Davis",
      email: "emily@example.com",
      logins: 56,
      searches: 152,
      interactions: 89,
      lastActive: "3 hours ago",
    },
    {
      user: "David Brown",
      email: "david@example.com",
      logins: 19,
      searches: 48,
      interactions: 27,
      lastActive: "2 days ago",
    },
  ]

  const contentReportData = [
    { month: "January", reports: 24, resolved: 22, dismissed: 2, avgResolutionTime: "1.2 days" },
    { month: "February", reports: 31, resolved: 28, dismissed: 3, avgResolutionTime: "1.5 days" },
    { month: "March", reports: 18, resolved: 15, dismissed: 3, avgResolutionTime: "1.1 days" },
    { month: "April", reports: 27, resolved: 25, dismissed: 2, avgResolutionTime: "0.9 days" },
    { month: "May", reports: 35, resolved: 30, dismissed: 5, avgResolutionTime: "1.3 days" },
  ]

  const financialData = [
    { company: "Acme Real Estate", plan: "Premium", amount: "$1,200", status: "Paid", date: "Jan 15, 2023" },
    { company: "Horizon Properties", plan: "Enterprise", amount: "$2,500", status: "Paid", date: "Feb 3, 2023" },
    { company: "Coastal Realty", plan: "Premium", amount: "$1,200", status: "Pending", date: "Feb 28, 2023" },
    { company: "Metro Housing Solutions", plan: "Basic", amount: "$600", status: "Paid", date: "Mar 10, 2023" },
    { company: "Mountain View Realty", plan: "Premium", amount: "$1,200", status: "Paid", date: "Apr 5, 2023" },
  ]

  const handleExport = (format: string) => {
    // In a real application, this would trigger an API call to generate the export
    console.log(`Exporting ${activeTab} report in ${format} format`)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Detailed Reports</CardTitle>
            <CardDescription>Comprehensive platform analytics</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("pdf")}>Export as PDF</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("csv")}>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("excel")}>Export as Excel</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="user-activity" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="user-activity">User Activity</TabsTrigger>
            <TabsTrigger value="content-reports">Content Reports</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
          </TabsList>
          <TabsContent value="user-activity" className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell isHeader>User</TableCell>
                  <TableCell isHeader>Logins</TableCell>
                  <TableCell isHeader>Searches</TableCell>
                  <TableCell isHeader>Interactions</TableCell>
                  <TableCell isHeader>Last Active</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userActivityData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{row.user}</div>
                        <div className="text-sm text-muted-foreground">{row.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{row.logins}</TableCell>
                    <TableCell>{row.searches}</TableCell>
                    <TableCell>{row.interactions}</TableCell>
                    <TableCell>{row.lastActive}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="content-reports" className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell isHeader>Month</TableCell>
                  <TableCell isHeader>Reports Filed</TableCell>
                  <TableCell isHeader>Resolved</TableCell>
                  <TableCell isHeader>Dismissed</TableCell>
                  <TableCell isHeader>Avg. Resolution Time</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contentReportData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.month}</TableCell>
                    <TableCell>{row.reports}</TableCell>
                    <TableCell>{row.resolved}</TableCell>
                    <TableCell>{row.dismissed}</TableCell>
                    <TableCell>{row.avgResolutionTime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="financial" className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell isHeader>Company</TableCell>
                  <TableCell isHeader>Plan</TableCell>
                  <TableCell isHeader>Amount</TableCell>
                  <TableCell isHeader>Status</TableCell>
                  <TableCell isHeader>Date</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financialData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.company}</TableCell>
                    <TableCell>{row.plan}</TableCell>
                    <TableCell>{row.amount}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          row.status === "Paid" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {row.status}
                      </span>
                    </TableCell>
                    <TableCell>{row.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
