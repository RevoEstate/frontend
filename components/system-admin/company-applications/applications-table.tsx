"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Eye,
  File,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ApplicationDetailsModal } from "./application-details-modal";
import { RejectApplicationDialog } from "./reject-application-dialog";
import { useCompanies } from "@/hooks/useCompanies";
import useCompanyStore from "@/stores/companyStore";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ApplicationsTable() {
  const [selectedApplication, setSelectedApplication] = useState<any | null>(
    null
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  // Get filter, sort, and pagination from store
  const { filter, sort, pagination, setPage, setLimit } = useCompanyStore();

  // Fetch companies data
  const { companies, total, isLoading, error } = useCompanies(
    filter,
    sort,
    pagination
  );

  const handleViewDetails = (application: any) => {
    setSelectedApplication(application);
    setIsDetailsModalOpen(true);
  };

  const handleApprove = (id: string) => {
    // In a real application, you would call an API to update the status
    console.log(`Approving application ${id}`);
    // Update local state or refetch data
  };

  const handleReject = (application: any) => {
    setSelectedApplication(application);
    setIsRejectDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "initial":
        return <Badge variant="outline">Pending</Badge>;
      case "under_review":
        return <Badge variant="secondary">Under Review</Badge>;
      case "approved":
        return (
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 hover:bg-green-100"
          >
            Approved
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Generate pagination items
  const generatePaginationItems = () => {
    const totalPages = Math.ceil(total / pagination.limit);
    const currentPage = pagination.page;

    const items = [];

    // Previous button
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious
          onClick={() => currentPage > 1 && setPage(currentPage - 1)}
          className={
            currentPage <= 1
              ? "pointer-events-none opacity-50"
              : "cursor-pointer"
          }
        />
      </PaginationItem>
    );

    // First page
    if (totalPages > 0) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            isActive={currentPage === 1}
            onClick={() => setPage(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Pages around current
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i <= 1 || i >= totalPages) continue;
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => setPage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Last page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={currentPage === totalPages}
            onClick={() => setPage(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Next button
    items.push(
      <PaginationItem key="next">
        <PaginationNext
          onClick={() => currentPage < totalPages && setPage(currentPage + 1)}
          className={
            currentPage >= totalPages
              ? "pointer-events-none opacity-50"
              : "cursor-pointer"
          }
        />
      </PaginationItem>
    );

    return items;
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <div className="p-4 space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="rounded-md border p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-600">
            Error loading applications
          </h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <Table className="[&_tr]:py-4">
        <TableHeader>
          <TableRow>
            <TableCell isHeader className="w-[40px]">
              #
            </TableCell>
            <TableCell isHeader>Company Name</TableCell>
            <TableCell isHeader>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => {
                  // Implement sorting by date if needed
                  console.log("Sort by date");
                }}
              >
                Application Date
                {sort.field === "createdAt" &&
                  (sort.direction === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  ))}
              </div>
            </TableCell>
            <TableCell isHeader>Status</TableCell>
            <TableCell isHeader className="text-right">
              Actions
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.length === 0 ? (
            <TableRow>
              <TableCell className="h-24 text-center">
                <td colSpan={5}>No applications found</td>
              </TableCell>
            </TableRow>
          ) : (
            companies.map((application, index) => (
              <TableRow key={application._id} className="">
                <TableCell className="font-medium text-muted-foreground">
                  {(pagination.page - 1) * pagination.limit + index + 1}
                </TableCell>
                <TableCell className="font-medium">
                  {application.realEstateName.slice(0, 20)}..
                </TableCell>
                <TableCell>
                  {format(new Date(application.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  {getStatusBadge(application.verificationStatus)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="m-1"
                      onClick={() => handleViewDetails(application)}
                    >
                      <Eye className="h-4 w-4 m-1" />
                      View
                    </Button>
                    {application.verificationStatus !== "approved" &&
                      application.verificationStatus !== "rejected" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="m-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleApprove(application._id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="m-1 text-red-600 hover:text-red-700 hover:bg-red-50"
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
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      {!isLoading && companies.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, total)} of {total}{" "}
            applications
          </div>
          <div className="flex items-center space-x-2">
            <Select
              value={pagination.limit.toString()}
              onValueChange={(value) => setLimit(Number.parseInt(value))}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <Pagination>
              <PaginationContent>{generatePaginationItems()}</PaginationContent>
            </Pagination>
          </div>
        </div>
      )}

      {selectedApplication && (
        <>
          <ApplicationDetailsModal
            application={{
              id: selectedApplication._id,
              companyName: selectedApplication.realEstateName,
              applicationDate: new Date(selectedApplication.createdAt),
              taxId: selectedApplication.phone, // Using phone as taxId
              documentsUploaded: selectedApplication.documentUrl
                ? [
                    selectedApplication.documentUrl.split("/").pop() ||
                      "document.pdf",
                  ]
                : [],
              status: selectedApplication.verificationStatus,
              contentOwner: {
                name: selectedApplication.realEstateName,
                email: selectedApplication.email,
                avatar: "",
              },
            }}
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            onApprove={() => {
              handleApprove(selectedApplication._id);
              setIsDetailsModalOpen(false);
            }}
            onReject={() => {
              setIsDetailsModalOpen(false);
              setIsRejectDialogOpen(true);
            }}
          />

          <RejectApplicationDialog
            application={{
              id: selectedApplication._id,
              companyName: selectedApplication.realEstateName,
            }}
            isOpen={isRejectDialogOpen}
            onClose={() => setIsRejectDialogOpen(false)}
            onReject={(reason) => {
              console.log(
                `Rejecting application ${selectedApplication._id} with reason: ${reason}`
              );
              setIsRejectDialogOpen(false);
              // In a real application, you would call an API to update the status
            }}
          />
        </>
      )}
    </div>
  );
}
