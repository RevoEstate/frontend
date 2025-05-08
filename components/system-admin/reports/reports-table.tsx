"use client"

import { useState } from "react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { Ban, ChevronLeft, ChevronRight, Eye, MoreHorizontal, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { RemoveContentDialog } from "./remove-content-dialog"
import { DismissReportDialog } from "./dismiss-report-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useReports } from "@/hooks/use-reports";
import { useReportsStore } from "@/store/reports";
import { Report } from "@/types/report";
import { Skeleton } from "@/components/ui/skeleton";

export function ContentReportsTable() {
  const router = useRouter();
  const { reports, isLoading } = useReports();
  console.log("reports in table :", reports);
  const reportsList = reports?.data?.reports || [];
  const totalItems = reports?.data?.total || 0;
  const { setSelectedReport, selectedReport } = useReportsStore();
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isDismissDialogOpen, setIsDismissDialogOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const handleViewDetails = (report: Report) => {
    router.push(`/dashboard/reports/${report.reportId}`);
  };

  const handleRemoveContent = (report: Report) => {
    setSelectedReport(report);
    setIsRemoveDialogOpen(true);
  };

  const handleDismissReport = (report: Report) => {
    setSelectedReport(report);
    setIsDismissDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="outline" className="text-amber-600 bg-amber-50">
            Open
          </Badge>
        );
      case "resolved":
        return (
          <Badge variant="outline" className="text-green-600 bg-green-50">
            Resolved
          </Badge>
        );
      case "dismissed":
        return (
          <Badge variant="outline" className="text-gray-600 bg-gray-50">
            Dismissed
          </Badge>
        );
      default:
        return null;
    }
  };

  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: rowsPerPage }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentReports = reportsList.slice(startIndex, endIndex);

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Reporter</TableCell>
                <TableCell>Property</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentReports.map((report) => (
                <TableRow key={report._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {report.reporter?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {`${report.reporter?.name || ""}`?.trim() ||
                            "Unknown"}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {report.reporter?.email || "No email"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {report.property?.title || "Unknown Property"}
                      </span>
                      {/* <span className="text-sm text-muted-foreground">
                        ID: {report.propertyId}
                      </span> */}
                    </div>
                  </TableCell>
                  <TableCell>{report.reason}</TableCell>
                  <TableCell>
                    {format(new Date(report.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(report)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {report.status === "open" && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleRemoveContent(report)}
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              Remove Content
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDismissReport(report)}
                            >
                              <X className="mr-2 h-4 w-4" />
                              Dismiss Report
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPrevPage}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {selectedReport && (
        <>
          <RemoveContentDialog
            open={isRemoveDialogOpen}
            onOpenChange={setIsRemoveDialogOpen}
          />
          <DismissReportDialog
            open={isDismissDialogOpen}
            onOpenChange={setIsDismissDialogOpen}
          />
        </>
      )}
    </>
  );
}
