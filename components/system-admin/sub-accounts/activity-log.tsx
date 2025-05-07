"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ChevronLeft, ChevronRight, Clock, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Mock data for demonstration
const activityLogs = [
  {
    id: "ACT-1001",
    user: {
      id: "SA-1001",
      name: "John Smith",
      role: "Manager",
    },
    action: "Approved listing",
    details: "Approved property listing ID: PROP-28374",
    timestamp: new Date(2023, 10, 15, 14, 35),
  },
  {
    id: "ACT-1002",
    user: {
      id: "SA-1002",
      name: "Maria Johnson",
      role: "Sub-Admin",
    },
    action: "Updated user account",
    details: "Updated account details for user ID: USR-45678",
    timestamp: new Date(2023, 10, 15, 13, 20),
  },
  {
    id: "ACT-1003",
    user: {
      id: "SA-1004",
      name: "Emily Davis",
      role: "Content Moderator",
    },
    action: "Removed content",
    details: "Removed inappropriate content from property ID: PROP-39485",
    timestamp: new Date(2023, 10, 15, 11, 45),
  },
  {
    id: "ACT-1004",
    user: {
      id: "SA-1005",
      name: "David Brown",
      role: "Manager",
    },
    action: "Generated analytics report",
    details: "Generated monthly performance report for Q3",
    timestamp: new Date(2023, 10, 15, 10, 30),
  },
  {
    id: "ACT-1004",
    user: {
      id: "SA-1005",
      name: "David Brown",
      role: "Manager",
    },
    action: "Generated analytics report",
    details: "Generated monthly performance report for Q3",
    timestamp: new Date(2023, 10, 15, 10, 30),
  },
  {
    id: "ACT-1005",
    user: {
      id: "SA-1002",
      name: "Maria Johnson",
      role: "Sub-Admin",
    },
    action: "Reset user password",
    details: "Reset password for user ID: USR-56789",
    timestamp: new Date(2023, 10, 15, 9, 15),
  },
  {
    id: "ACT-1006",
    user: {
      id: "SA-1001",
      name: "John Smith",
      role: "Manager",
    },
    action: "Responded to issue",
    details: "Responded to customer issue ID: ISS-1002",
    timestamp: new Date(2023, 10, 14, 16, 45),
  },
  {
    id: "ACT-1007",
    user: {
      id: "SA-1007",
      name: "Michael Taylor",
      role: "Support",
    },
    action: "Updated platform policy",
    details: "Updated refund policy ID: POL-1003",
    timestamp: new Date(2023, 10, 14, 15, 30),
  },
  {
    id: "ACT-1008",
    user: {
      id: "SA-1009",
      name: "James Anderson",
      role: "Manager",
    },
    action: "Created sub-account",
    details: "Created new sub-account for Lisa Martin (SA-1010)",
    timestamp: new Date(2023, 10, 14, 14, 20),
  },
  {
    id: "ACT-1009",
    user: {
      id: "SA-1004",
      name: "Emily Davis",
      role: "Content Moderator",
    },
    action: "Dismissed report",
    details: "Dismissed content report ID: RPT-1005",
    timestamp: new Date(2023, 10, 14, 13, 10),
  },
  {
    id: "ACT-1010",
    user: {
      id: "SA-1002",
      name: "Maria Johnson",
      role: "Sub-Admin",
    },
    action: "Deactivated account",
    details: "Deactivated sub-account ID: SA-1003",
    timestamp: new Date(2023, 10, 14, 11, 45),
  },
]

export function ActivityLog() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 5
  const totalPages = Math.ceil(activityLogs.length / rowsPerPage)

  // Calculate the current page's data
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentLogs = activityLogs.slice(indexOfFirstRow, indexOfLastRow)

  // Pagination controls
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {currentLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-4 p-3 border rounded-md">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{log.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{log.user.name}</span>
                    <span className="text-xs bg-muted px-1.5 py-0.5 rounded-md flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      {log.user.role}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(log.timestamp, "MMM d, h:mm a")}
                  </span>
                </div>
                <p className="text-sm font-medium mt-1">{log.action}</p>
                <p className="text-sm text-muted-foreground">{log.details}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{indexOfFirstRow + 1}</span> to{" "}
            <span className="font-medium">{Math.min(indexOfLastRow, activityLogs.length)}</span> of{" "}
            <span className="font-medium">{activityLogs.length}</span> activities
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={goToPrevPage} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous Page</span>
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextPage} disabled={currentPage === totalPages}>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next Page</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
