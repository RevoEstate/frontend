"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  Ban,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  Play,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SuspendCompanyDialog } from "./suspend-company-dialog";
import { DeactivateCompanyDialog } from "./deactivate-company-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CompaniesTable() {
  const router = useRouter();
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: {
      suspending: boolean;
      activating: boolean;
      deactivating: boolean;
    };
  }>({});

  const { filter, sort, pagination, setSort, setPage, setLimit } =
    useCompanyStore();

  const {
    companies,
    total,
    isLoading,
    error,
    suspendCompany,
    isSuspending,
    activateCompany,
    isActivating,
    deactivateCompany,
    isDeactivating,
  } = useCompanies();

  const handleViewProfile = (company: any) => {
    router.push(`/dashboard/companies/${company._id}`);
  };

  const handleSuspend = (company: any) => {
    setSelectedCompany(company);
    setIsSuspendDialogOpen(true);
  };

  const handleActivate = (id: string) => {
    setLoadingStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], activating: true },
    }));

    activateCompany(
      { companyId: id },
      {
        onSuccess: () => {
          toast.success("Company activated successfully!");
          setLoadingStates((prev) => ({
            ...prev,
            [id]: { ...prev[id], activating: false },
          }));
        },
        onError: () => {
          toast.error("Failed to activate company. Please try again.");
          setLoadingStates((prev) => ({
            ...prev,
            [id]: { ...prev[id], activating: false },
          }));
        },
      }
    );
  };

  const handleDeactivate = (company: any) => {
    setSelectedCompany(company);
    setIsDeactivateDialogOpen(true);
  };

  const handleSort = (
    field: "realEstateName" | "createdAt" | "status" | "listingsCount"
  ) => {
    const newDirection =
      sort.field === field && sort.direction === "asc" ? "desc" : "asc";
    setSort({ field, direction: newDirection });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Active
          </Badge>
        );
      case "suspended":
        return (
          <Badge
            variant="secondary"
            className="bg-amber-100 text-amber-800 hover:bg-amber-100"
          >
            Suspended
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Inactive
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const generatePaginationItems = () => {
    const totalPages = Math.ceil(total / pagination.limit);
    const currentPage = pagination.page;

    const items = [];

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

    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

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

    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

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

  if (error) {
    return (
      <div className="rounded-md border p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-600">
            Error loading companies
          </h3>
          <p className="mt-1 text-sm text-gray-500">{error?.message}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="">
        <div className="overflow-x-auto">
          <Table className="[&_tr]:py-4">
            <TableHeader>
              <TableRow>
                <TableCell isHeader className="w-[40px]">
                  #
                </TableCell>
                <TableCell isHeader>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("realEstateName")}
                  >
                    Company Name
                    {sort.field === "realEstateName" &&
                      (sort.direction === "asc" ? (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4 rotate-180" />
                      ))}
                  </div>
                </TableCell>
                {/* <TableCell isHeader className="hidden md:table-cell">
                  Email
                </TableCell> */}
                <TableCell isHeader className="hidden md:table-cell">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("createdAt")}
                  >
                    Registration Date
                    {sort.field === "createdAt" &&
                      (sort.direction === "asc" ? (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4 rotate-180" />
                      ))}
                  </div>
                </TableCell>
                <TableCell isHeader className="hidden sm:table-cell">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("listingsCount")}
                  >
                    Listings
                    {sort.field === "listingsCount" &&
                      (sort.direction === "asc" ? (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4 rotate-180" />
                      ))}
                  </div>
                </TableCell>
                <TableCell isHeader>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    Status
                    {sort.field === "status" &&
                      (sort.direction === "asc" ? (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4 rotate-180" />
                      ))}
                  </div>
                </TableCell>
                <TableCell isHeader className="text-right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No companies found
                  </TableCell>
                </TableRow>
              ) : (
                companies.map((company, index) => (
                  <TableRow key={company._id} className="group">
                    <TableCell className="font-medium text-muted-foreground">
                      {(pagination.page - 1) * pagination.limit + index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 bg-primary/10 text-primary">
                          <AvatarFallback>
                            <Building2 className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {company.realEstateName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {company.address.city}, {company.address.region}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    {/* <TableCell className="hidden md:table-cell">
                      <a
                        href={`mailto:${company.email}`}
                        className="text-primary hover:underline"
                      >
                        {company.email}
                      </a>
                    </TableCell> */}
                    <TableCell className="hidden md:table-cell">
                      {format(new Date(company.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell font-medium">
                      {company.listingsCount}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(company.companyStatus)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only"></span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewProfile(company)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Profile</span>
                          </DropdownMenuItem>
                          {company.companyStatus === "suspended" ? (
                            <DropdownMenuItem
                              onClick={() => handleActivate(company._id)}
                              disabled={loadingStates[company._id]?.activating}
                            >
                              <Play className="mr-2 h-4 w-4" />
                              <span>
                                {loadingStates[company._id]?.activating
                                  ? "Activating..."
                                  : "Activate"}
                              </span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleSuspend(company)}
                              disabled={loadingStates[company._id]?.suspending}
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              <span>
                                {loadingStates[company._id]?.suspending
                                  ? "Suspending..."
                                  : "Suspend"}
                              </span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeactivate(company)}
                            className="text-red-600 focus:text-red-600"
                            disabled={loadingStates[company._id]?.deactivating}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>
                              {loadingStates[company._id]?.deactivating
                                ? "Deactivating..."
                                : "Deactivate"}
                            </span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {!isLoading && companies.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, total)} of {total}{" "}
            companies
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

      {selectedCompany && (
        <>
          <SuspendCompanyDialog
            company={selectedCompany}
            isOpen={isSuspendDialogOpen}
            onClose={() => setIsSuspendDialogOpen(false)}
            onSuspend={(reason) => {
              setLoadingStates((prev) => ({
                ...prev,
                [selectedCompany._id]: {
                  ...prev[selectedCompany._id],
                  suspending: true,
                },
              }));
              suspendCompany(
                { companyId: selectedCompany._id, reason },
                {
                  onSuccess: () => {
                    toast.success("Company suspended successfully!");
                    setIsSuspendDialogOpen(false);
                    setLoadingStates((prev) => ({
                      ...prev,
                      [selectedCompany._id]: {
                        ...prev[selectedCompany._id],
                        suspending: false,
                      },
                    }));
                  },
                  onError: () => {
                    toast.error("Failed to suspend company. Please try again.");
                    setLoadingStates((prev) => ({
                      ...prev,
                      [selectedCompany._id]: {
                        ...prev[selectedCompany._id],
                        suspending: false,
                      },
                    }));
                  },
                }
              );
            }}
          />

          <DeactivateCompanyDialog
            company={selectedCompany}
            isOpen={isDeactivateDialogOpen}
            onClose={() => setIsDeactivateDialogOpen(false)}
            onDeactivate={() => {
              setLoadingStates((prev) => ({
                ...prev,
                [selectedCompany._id]: {
                  ...prev[selectedCompany._id],
                  deactivating: true,
                },
              }));
              deactivateCompany(selectedCompany._id, {
                onSuccess: () => {
                  toast.success("Company deactivated successfully!");
                  setIsDeactivateDialogOpen(false);
                  setLoadingStates((prev) => ({
                    ...prev,
                    [selectedCompany._id]: {
                      ...prev[selectedCompany._id],
                      deactivating: false,
                    },
                  }));
                },
                onError: () => {
                  toast.error(
                    "Failed to deactivate company. Please try again."
                  );
                  setLoadingStates((prev) => ({
                    ...prev,
                    [selectedCompany._id]: {
                      ...prev[selectedCompany._id],
                      deactivating: false,
                    },
                  }));
                },
              });
            }}
          />
        </>
      )}
    </div>
  );
}
