"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { useRouter } from "next/navigation"
import { Archive, ChevronLeft, ChevronRight, Edit, Eye, FileText, MoreHorizontal, Loader2 } from "lucide-react"

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
import { usePolicies } from "@/hooks/usePolicy"
import { Policy, PolicyFilters } from "@/types/policy"
import { Skeleton } from "@/components/ui/skeleton"

export function PoliciesTable() {
  const router = useRouter()
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false)
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)

  // Pagination and filtering state
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<PolicyFilters>({
    page: 1,
    limit: 7,
  })

  // Fetch policies from API
  const { data, isLoading, isError } = usePolicies(filters)
  const policies = data?.policies || []
  console.log("policies", policies)
  const totalPolicies = data?.total || 0
  const totalPages = Math.ceil(totalPolicies / (filters.limit || 7))

  const handleEditPolicy = (policy: Policy) => {
    router.push(`/dashboard/policies/${policy._id}`)
  }

  const handleArchivePolicy = (policy: Policy) => {
    setSelectedPolicy(policy)
    setIsArchiveDialogOpen(true)
  }

  const handlePreviewPolicy = (policy: Policy) => {
    setSelectedPolicy(policy)
    setIsPreviewDialogOpen(true)
  }

  // Pagination controls
  const goToNextPage = () => {
    const nextPage = Math.min(currentPage + 1, totalPages)
    setCurrentPage(nextPage)
    setFilters(prev => ({ ...prev, page: nextPage }))
  }
  
  const goToPrevPage = () => {
    const prevPage = Math.max(currentPage - 1, 1)
    setCurrentPage(prevPage)
    setFilters(prev => ({ ...prev, page: prevPage }))
  }

  return (
    <Card className="border-border/40">
      <CardContent className="p-0">
        <div className="rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableCell isHeader>Title</TableCell>
                  <TableCell isHeader className="hidden md:table-cell">Description</TableCell>
                  <TableCell isHeader>Effective Date</TableCell>
                  <TableCell isHeader>Last Updated</TableCell>
                  <TableCell isHeader>Status</TableCell>
                  <TableCell isHeader className="text-right">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: filters.limit || 7 }).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      <TableCell><Skeleton className="h-6 w-[180px]" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-[300px]" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-[120px]" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-[120px]" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-[50px] ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : isError ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Error loading policies. Please try again later.
                    </TableCell>
                  </TableRow>
                ) : policies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No policies found.
                    </TableCell>
                  </TableRow>
                ) : (
                  policies.map((policy) => (
                    <TableRow key={policy._id} className="group hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <span>{policy.title}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-[300px] truncate">{policy.description}</TableCell>
                      <TableCell>{format(parseISO(policy.effectiveDate), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{format(parseISO(policy.updatedAt), "MMM d, yyyy")}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            policy.status === "active" 
                              ? "bg-green-100 text-green-800" 
                              : policy.status === "archived"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-gray-100 text-gray-800"
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
                              {/* <DropdownMenuItem onClick={() => handleEditPolicy(policy)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                              </DropdownMenuItem> */}
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              {isLoading ? (
                <Skeleton className="h-5 w-[250px]" />
              ) : (
                <>
                  Showing <span className="font-medium">{policies.length ? (currentPage - 1) * (filters.limit || 7) + 1 : 0}</span> to{" "}
                  <span className="font-medium">{Math.min(currentPage * (filters.limit || 7), totalPolicies)}</span> of{" "}
                  <span className="font-medium">{totalPolicies}</span> policies
                </>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToPrevPage} 
                disabled={isLoading || currentPage === 1}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
                <span className="sr-only">Previous Page</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToNextPage} 
                disabled={isLoading || currentPage === totalPages || totalPages === 0}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
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
            onArchive={() => setIsArchiveDialogOpen(false)}
          />
          <PreviewPolicyDialog
            policy={selectedPolicy}
            isOpen={isPreviewDialogOpen}
            onClose={() => setIsPreviewDialogOpen(false)}
          />
        </>
      )}
    </Card>
  );
}
