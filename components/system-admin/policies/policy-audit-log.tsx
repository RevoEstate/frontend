"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ChevronLeft, ChevronRight, Clock, FileText, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for demonstration
const auditLogs = [
  {
    id: "AUD-1001",
    policyId: "POL-1002",
    policyTitle: "Privacy Policy",
    action: "updated",
    user: "Admin User",
    timestamp: new Date(2023, 10, 5, 14, 30),
    details: "Updated Privacy Policy to include new data processing information.",
  },
  {
    id: "AUD-1002",
    policyId: "POL-1004",
    policyTitle: "Content Guidelines",
    action: "updated",
    user: "Admin User",
    timestamp: new Date(2023, 9, 20, 11, 45),
    details: "Updated Content Guidelines with new restrictions on prohibited content.",
  },
  {
    id: "AUD-1003",
    policyId: "POL-1006",
    policyTitle: "Data Retention Policy",
    action: "updated",
    user: "Admin User",
    timestamp: new Date(2023, 8, 15, 10, 30),
    details: "Updated Data Retention Policy to comply with new regulations.",
  },
  {
    id: "AUD-1004",
    policyId: "POL-1008",
    policyTitle: "Acceptable Use Policy",
    action: "archived",
    user: "Admin User",
    timestamp: new Date(2023, 7, 5, 16, 15),
    details: "Archived Acceptable Use Policy as it has been replaced by Content Guidelines.",
  },
  {
    id: "AUD-1005",
    policyId: "POL-1010",
    policyTitle: "Community Guidelines",
    action: "updated",
    user: "Admin User",
    timestamp: new Date(2023, 6, 10, 9, 45),
    details: "Updated Community Guidelines with new section on harassment prevention.",
  },
  {
    id: "AUD-1006",
    policyId: "POL-1010",
    policyTitle: "Community Guidelines",
    action: "archived",
    user: "Admin User",
    timestamp: new Date(2023, 6, 10, 15, 30),
    details: "Archived Community Guidelines after updating to new version.",
  },
  {
    id: "AUD-1007",
    policyId: "POL-1001",
    policyTitle: "Terms of Service",
    action: "created",
    user: "Admin User",
    timestamp: new Date(2023, 9, 15, 13, 20),
    details: "Created new Terms of Service document.",
  },
  {
    id: "AUD-1008",
    policyId: "POL-1002",
    policyTitle: "Privacy Policy",
    action: "created",
    user: "Admin User",
    timestamp: new Date(2023, 9, 15, 14, 10),
    details: "Created new Privacy Policy document.",
  },
  {
    id: "AUD-1009",
    policyId: "POL-1003",
    policyTitle: "Refund Policy",
    action: "created",
    user: "Admin User",
    timestamp: new Date(2023, 8, 1, 11, 30),
    details: "Created new Refund Policy document.",
  },
  {
    id: "AUD-1010",
    policyId: "POL-1004",
    policyTitle: "Content Guidelines",
    action: "created",
    user: "Admin User",
    timestamp: new Date(2023, 7, 10, 10, 15),
    details: "Created new Content Guidelines document.",
  },
]

export function PolicyAuditLog() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 5
  const totalPages = Math.ceil(auditLogs.length / rowsPerPage)

  // Calculate the current page's data
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentLogs = auditLogs.slice(indexOfFirstRow, indexOfLastRow)

  // Pagination controls
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))

  const getActionBadge = (action: string) => {
    switch (action) {
      case "created":
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            Created
          </span>
        )
      case "updated":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            Updated
          </span>
        )
      case "archived":
        return (
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
            Archived
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {action.charAt(0).toUpperCase() + action.slice(1)}
          </span>
        )
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Policy Audit Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {currentLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-4 p-3 border rounded-md">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="font-medium">{log.policyTitle}</span>
                    <span className="text-xs text-muted-foreground">({log.policyId})</span>
                    {getActionBadge(log.action)}
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(log.timestamp, "MMM d, yyyy h:mm a")}
                  </span>
                </div>
                <p className="text-sm mt-1">{log.details}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>By {log.user}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{indexOfFirstRow + 1}</span> to{" "}
            <span className="font-medium">{Math.min(indexOfLastRow, auditLogs.length)}</span> of{" "}
            <span className="font-medium">{auditLogs.length}</span> audit logs
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
