"use client"

import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  MessageSquare,
  MoreHorizontal,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { useIssues } from "@/hooks/useIssues";
import { useIssuesStore } from "@/store/issues";
import { Issue, IssueStatus, IssueType } from "@/types/issue";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function IssuesTable() {
  const router = useRouter()
  const { filters, setFilters } = useIssuesStore();
  const { data, isLoading, isError } = useIssues();

  const handleViewDetails = (issue: Issue) => {
    router.push(`/dashboard/issues/${issue._id}`);
  };

  const handleRespond = (issue: Issue) => {
    router.push(`/dashboard/issues/${issue._id}?respond=true`);
  };

  const getStatusBadge = (status: IssueStatus) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="outline" className="text-amber-600 bg-amber-50">
            Open
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="outline" className="text-blue-600 bg-blue-50">
            In Progress
          </Badge>
        );
      case "resolved":
        return (
          <Badge variant="outline" className="text-green-600 bg-green-50">
            Resolved
          </Badge>
        );
      case "closed":
        return (
          <Badge variant="outline" className="text-gray-600 bg-gray-50">
            Closed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: IssueType) => {
    const types: Record<string, { color: string; bgColor: string }> = {
      technical: { color: "text-purple-600", bgColor: "bg-purple-50" },
      property: { color: "text-blue-600", bgColor: "bg-blue-50" },
      billing: { color: "text-green-600", bgColor: "bg-green-50" },
      account: { color: "text-orange-600", bgColor: "bg-orange-50" },
      other: { color: "text-gray-600", bgColor: "bg-gray-50" },
    };

    const style = types[type] || {
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    };

    return (
      <Badge variant="outline" className={`${style.color} ${style.bgColor}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  // Pagination controls
  const goToNextPage = () => setFilters({ page: (filters.page || 1) + 1 });
  const goToPrevPage = () =>
    setFilters({ page: Math.max((filters.page || 1) - 1, 1) });

  if (isLoading) {
    return (
      <Card className="border-border/40">
        <CardContent className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border-border/40">
        <CardContent className="flex justify-center items-center min-h-[400px]">
          <p className="text-destructive">
            Failed to load issues. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!data?.data.issues.length) {
    return (
      <Card className="border-border/40">
        <CardContent className="flex justify-center items-center min-h-[400px]">
          <p className="text-muted-foreground">No issues found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/40">
      <CardContent className="p-0">
        <div className="rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableCell isHeader className="w-[80px]">
                    Issue ID
                  </TableCell>
                  <TableCell isHeader>Raised By</TableCell>
                  <TableCell isHeader className="hidden md:table-cell">
                    Issue Summary
                  </TableCell>
                  <TableCell isHeader>Date Raised</TableCell>
                  <TableCell isHeader>Status</TableCell>
                  <TableCell isHeader>Type</TableCell>
                  <TableCell isHeader className="text-right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.issues.map((issue) => (
                  <TableRow
                    key={issue._id}
                    className="group hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {issue.issueId}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          {issue.raisedBy.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={issue.raisedBy.avatar}
                              alt={issue.raisedBy.name}
                              className="object-cover"
                            />
                          ) : (
                            <AvatarFallback>
                              {issue.raisedBy.name[0]}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="hidden sm:block">
                          <p className="text-sm font-medium">
                            {issue.raisedBy.name}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {issue.raisedBy.type}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                      <p className="text-sm truncate">{issue.summary}</p>
                    </TableCell>
                    <TableCell>
                      {format(new Date(issue.dateRaised), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>{getStatusBadge(issue.status)}</TableCell>
                    <TableCell>{getTypeBadge(issue.type)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleViewDetails(issue)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            {issue.status !== "resolved" &&
                              issue.status !== "closed" && (
                                <DropdownMenuItem
                                  onClick={() => handleRespond(issue)}
                                >
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  <span>Respond</span>
                                </DropdownMenuItem>
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
              Showing{" "}
              <span className="font-medium">
                {((filters.page || 1) - 1) * (filters.limit || 10) + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(
                  (filters.page || 1) * (filters.limit || 10),
                  data.data.total
                )}
              </span>{" "}
              of <span className="font-medium">{data.data.total}</span> issues
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevPage}
                disabled={filters.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous Page</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={filters.page === data.data.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next Page</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
