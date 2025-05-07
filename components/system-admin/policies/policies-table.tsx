"use client"

import { useState } from "react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { Archive, ChevronLeft, ChevronRight, Edit, Eye, FileText, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { ArchivePolicyDialog } from "./archive-policy-dialog"
import { PreviewPolicyDialog } from "./preview-policy-dialog"

// Mock data for demonstration
const policies = [
  {
    id: "POL-1001",
    title: "Terms of Service",
    description:
      "These Terms of Service govern your use of our platform and services. By accessing or using our services, you agree to be bound by these terms.",
    effectiveDate: new Date(2023, 9, 15),
    lastUpdated: new Date(2023, 9, 15),
    status: "active",
    version: "1.0",
  },
  {
    id: "POL-1002",
    title: "Privacy Policy",
    description:
      "This Privacy Policy describes how we collect, use, and share your personal information when you use our platform and services.",
    effectiveDate: new Date(2023, 9, 15),
    lastUpdated: new Date(2023, 10, 5),
    status: "active",
    version: "1.1",
  },
  {
    id: "POL-1003",
    title: "Refund Policy",
    description:
      "This Refund Policy outlines the conditions under which we will provide refunds for services purchased on our platform.",
    effectiveDate: new Date(2023, 8, 1),
    lastUpdated: new Date(2023, 8, 1),
    status: "active",
    version: "1.0",
  },
  {
    id: "POL-1004",
    title: "Content Guidelines",
    description:
      "These Content Guidelines outline the types of content that are permitted and prohibited on our platform.",
    effectiveDate: new Date(2023, 7, 10),
    lastUpdated: new Date(2023, 9, 20),
    status: "active",
    version: "2.0",
  },
  {
    id: "POL-1005",
    title: "User Conduct Policy",
    description:
      "This User Conduct Policy describes the expected behavior of users on our platform and the consequences of violating these expectations.",
    effectiveDate: new Date(2023, 6, 15),
    lastUpdated: new Date(2023, 6, 15),
    status: "active",
    version: "1.0",
  },
  {
    id: "POL-1006",
    title: "Data Retention Policy",
    description:
      "This Data Retention Policy outlines how long we keep different types of data and when it will be deleted from our systems.",
    effectiveDate: new Date(2023, 5, 1),
    lastUpdated: new Date(2023, 8, 15),
    status: "active",
    version: "1.2",
  },
  {
    id: "POL-1007",
    title: "Cookie Policy",
    description:
      "This Cookie Policy explains how we use cookies and similar technologies on our website and the options you have to control them.",
    effectiveDate: new Date(2023, 4, 20),
    lastUpdated: new Date(2023, 4, 20),
    status: "active",
    version: "1.0",
  },
  {
    id: "POL-1008",
    title: "Acceptable Use Policy",
    description: "This Acceptable Use Policy outlines the permitted and prohibited uses of our platform and services.",
    effectiveDate: new Date(2023, 3, 10),
    lastUpdated: new Date(2023, 7, 5),
    status: "archived",
    version: "1.1",
  },
  {
    id: "POL-1009",
    title: "DMCA Policy",
    description:
      "This DMCA Policy outlines the process for reporting copyright infringement and how we respond to such reports.",
    effectiveDate: new Date(2023, 2, 15),
    lastUpdated: new Date(2023, 2, 15),
    status: "active",
    version: "1.0",
  },
  {
    id: "POL-1010",
    title: "Community Guidelines",
    description:
      "These Community Guidelines outline the standards and expectations for all users participating in our community.",
    effectiveDate: new Date(2023, 1, 1),
    lastUpdated: new Date(2023, 6, 10),
    status: "archived",
    version: "2.0",
  },
]

export function PoliciesTable() {
  const router = useRouter()
  const [selectedPolicy, setSelectedPolicy] = useState<(typeof policies)[0] | null>(null)
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false)
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 7
  const totalPages = Math.ceil(policies.length / rowsPerPage)

  const handleEditPolicy = (policy: (typeof policies)[0]) => {
    router.push(`/dashboard/policies/${policy.id}`)
  }

  const handleArchivePolicy = (policy: (typeof policies)[0]) => {
    setSelectedPolicy(policy)
    setIsArchiveDialogOpen(true)
  }

  const handlePreviewPolicy = (policy: (typeof policies)[0]) => {
    setSelectedPolicy(policy)
    setIsPreviewDialogOpen(true)
  }

  // Calculate the current page's data
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentPolicies = policies.slice(indexOfFirstRow, indexOfLastRow)

  // Pagination controls
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))

  return (
    <Card className="border-border/40">
      <CardContent className="p-0">
        <div className="rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableCell isHeader className="w-[100px]">Policy ID</TableCell>
                  <TableCell isHeader>Title</TableCell>
                  <TableCell isHeader className="hidden md:table-cell">Description</TableCell>
                  <TableCell isHeader>Effective Date</TableCell>
                  <TableCell isHeader>Last Updated</TableCell>
                  <TableCell isHeader>Status</TableCell>
                  <TableCell isHeader className="text-right">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPolicies.map((policy) => (
                  <TableRow key={policy.id} className="group hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{policy.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span>{policy.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-[300px] truncate">{policy.description}</TableCell>
                    <TableCell>{format(policy.effectiveDate, "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{format(policy.lastUpdated, "MMM d, yyyy")}</span>
                        <span className="text-xs text-muted-foreground">v{policy.version}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          policy.status === "active" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handlePreviewPolicy(policy)}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Preview</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditPolicy(policy)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            {policy.status === "active" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleArchivePolicy(policy)}>
                                  <Archive className="mr-2 h-4 w-4" />
                                  <span>Archive</span>
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{indexOfFirstRow + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastRow, policies.length)}</span> of{" "}
              <span className="font-medium">{policies.length}</span> policies
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
        </div>
      </CardContent>

      {selectedPolicy && (
        <>
          <ArchivePolicyDialog
            policy={selectedPolicy}
            isOpen={isArchiveDialogOpen}
            onClose={() => setIsArchiveDialogOpen(false)}
            onArchive={() => {
              console.log(`Archiving policy ${selectedPolicy.id}`)
              setIsArchiveDialogOpen(false)
              // In a real application, you would call an API to archive the policy
            }}
          />

          <PreviewPolicyDialog
            policy={selectedPolicy}
            isOpen={isPreviewDialogOpen}
            onClose={() => setIsPreviewDialogOpen(false)}
          />
        </>
      )}
    </Card>
  )
}
