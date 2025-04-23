"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Check, ChevronLeft, ChevronRight, Eye, File, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ApplicationDetailsModal } from "./application-details-modal"
import { RejectApplicationDialog } from "./reject-application-dialog"
import { applications } from "@/data/applications"
import { Separator } from "@/components/ui/separator"

export function ApplicationsTable() {
  const [selectedApplication, setSelectedApplication] = useState<(typeof applications)[0] | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 7
  const totalPages = Math.ceil(applications.length / rowsPerPage)

  const handleViewDetails = (application: (typeof applications)[0]) => {
    setSelectedApplication(application)
    setIsDetailsModalOpen(true)
  }

  const handleApprove = (id: string) => {
    // In a real application, you would call an API to update the status
    console.log(`Approving application ${id}`)
    // Update local state or refetch data
  }

  const handleReject = (application: (typeof applications)[0]) => {
    setSelectedApplication(application)
    setIsRejectDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "review":
        return <Badge variant="secondary">Under Review</Badge>
      case "approved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
            Approved
          </Badge>
        )
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Calculate the current page's data
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentApplications = applications.slice(indexOfFirstRow, indexOfLastRow)

  // Pagination controls
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))

  return (
    <div className="rounded-md">
      <Table className="[&_tr]:py-4">
        <TableHeader>
          <TableRow>
            <TableCell className="w-[60px]">#</TableCell>
            <TableCell className="text-left">Company Name</TableCell>
            <TableCell className="text-left">Application Date</TableCell>
            <TableCell className="text-left">Tax ID</TableCell>
            <TableCell className="text-left">Documents</TableCell>
            <TableCell className="text-left">Status</TableCell>
            <TableCell className="text-right">Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentApplications.map((application, index) => (
            <TableRow key={application.id} className="py-3">
              <TableCell className="font-medium text-muted-foreground">{indexOfFirstRow + index + 1}</TableCell>
              <TableCell className="font-medium">{application.companyName}</TableCell>
              <TableCell>{format(application.applicationDate, "MMM d, yyyy")}</TableCell>
              <TableCell>{application.taxId}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <File className="h-4 w-4" />
                  <span>{application.documentsUploaded.length}</span>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(application.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(application)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  {application.status !== "approved" && application.status !== "rejected" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => handleApprove(application.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleReject(application)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Separator className="my-4" />

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{indexOfFirstRow + 1}</span> to{" "}
          <span className="font-medium">{Math.min(indexOfLastRow, applications.length)}</span> of{" "}
          <span className="font-medium">{applications.length}</span> applications
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

      {selectedApplication && (
        <>
          <ApplicationDetailsModal
            application={selectedApplication}
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            onApprove={() => {
              handleApprove(selectedApplication.id)
              setIsDetailsModalOpen(false)
            }}
            onReject={() => {
              setIsDetailsModalOpen(false)
              setIsRejectDialogOpen(true)
            }}
          />

          <RejectApplicationDialog
            application={selectedApplication}
            isOpen={isRejectDialogOpen}
            onClose={() => setIsRejectDialogOpen(false)}
            onReject={(reason) => {
              console.log(`Rejecting application ${selectedApplication.id} with reason: ${reason}`)
              setIsRejectDialogOpen(false)
              // In a real application, you would call an API to update the status
            }}
          />
        </>
      )}
    </div>
  )
}
