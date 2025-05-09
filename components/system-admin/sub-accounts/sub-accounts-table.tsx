"use client"

import { useState } from "react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Edit, MoreHorizontal, Shield, ShieldAlert, ShieldOff, Trash2 } from "lucide-react"

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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DeactivateAccountDialog } from "./deactivate-account-dialog"
import { DeleteAccountDialog } from "./delete-account-dialog"
import {
  useStaff,
  useStaffStore,
  useDeleteStaff,
  useDeactivateStaff,
  Staff,
} from "@/hooks/useStaff";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function SubAccountsTable() {
  const router = useRouter()
  const [selectedAccount, setSelectedAccount] = useState<Staff | null>(null);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Get filters and pagination from store
  const { filters, setFilters } = useStaffStore();

  // Fetch staff data
  const { data, isLoading, isError } = useStaff();
  const { deleteStaff, isPending: isDeleting } = useDeleteStaff();
  const { deactivateStaff, isDeactivating } = useDeactivateStaff();

  const handleEditAccount = (account: Staff) => {
    router.push(`/dashboard/sub-accounts/${account._id}`);
  };

  const handleDeactivateAccount = (account: Staff) => {
    setSelectedAccount(account);
    setIsDeactivateDialogOpen(true);
  };

  const handleDeleteAccount = (account: Staff) => {
    setSelectedAccount(account);
    setIsDeleteDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="text-green-600 bg-green-50">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="outline" className="text-red-600 bg-red-50">
            Inactive
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Manager":
        return (
          <div className="flex items-center gap-1">
            <Shield className="h-3.5 w-3.5 text-blue-500" />
            <span>{role}</span>
          </div>
        );
      case "Sub-Admin":
        return (
          <div className="flex items-center gap-1">
            <ShieldAlert className="h-3.5 w-3.5 text-purple-500" />
            <span>{role}</span>
          </div>
        );
      case "Support":
        return (
          <div className="flex items-center gap-1">
            <ShieldOff className="h-3.5 w-3.5 text-green-500" />
            <span>{role}</span>
          </div>
        );
      case "Content Moderator":
        return (
          <div className="flex items-center gap-1">
            <ShieldOff className="h-3.5 w-3.5 text-amber-500" />
            <span>{role}</span>
          </div>
        );
      default:
        return <span>{role}</span>;
    }
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

  if (isError || !data) {
    return (
      <Card className="border-border/40">
        <CardContent className="flex justify-center items-center min-h-[400px]">
          <p className="text-destructive">
            Failed to load staff accounts. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { staff, total, page, totalPages } = data.data;

  return (
    <Card className="border-border/40">
      <CardContent className="p-0">
        <div className="rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableCell isHeader className="w-[60px]">
                    #
                  </TableCell>
                  <TableCell isHeader>Name</TableCell>
                  <TableCell isHeader>Email</TableCell>
                  <TableCell isHeader>Role</TableCell>
                  {/* <TableCell isHeader>Status</TableCell> */}
                  {/* <TableCell isHeader>Last Login</TableCell> */}
                  <TableCell isHeader className="text-right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No staff accounts found.
                    </TableCell>
                  </TableRow>
                ) : (
                  staff.map((account, index) => (
                    <TableRow
                      key={account._id}
                      className="group hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-medium text-muted-foreground">
                        {(page - 1) * (filters.limit || 10) + index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {account.firstName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{account.firstName} {account.lastName}</p>
                            <p className="text-xs text-muted-foreground">
                              ID: {account._id}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{account.email}</TableCell>
                      <TableCell>{getRoleBadge(account.role)}</TableCell>
                      {/* <TableCell>{getStatusBadge(account.status)}</TableCell> */}
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
                                onClick={() => handleEditAccount(account)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeactivateAccount(account)}
                                disabled={account.status === "inactive"}
                              >
                                <ShieldOff className="mr-2 h-4 w-4" />
                                <span>Deactivate</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteAccount(account)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
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
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium">
                  {(page - 1) * (filters.limit || 10) + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(page * (filters.limit || 10), total)}
                </span>{" "}
                of <span className="font-medium">{total}</span> accounts
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPrevPage}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous Page</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next Page</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {selectedAccount && (
        <>
          <DeactivateAccountDialog
            account={selectedAccount}
            isOpen={isDeactivateDialogOpen}
            onClose={() => setIsDeactivateDialogOpen(false)}
            onDeactivate={() => {
              if (selectedAccount) {
                deactivateStaff(selectedAccount._id);
                setIsDeactivateDialogOpen(false);
              }
            }}
            isDeactivating={isDeactivating}
          />

          <DeleteAccountDialog
            account={selectedAccount}
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onDelete={() => {
              if (selectedAccount) {
                deleteStaff(selectedAccount._id);
                setIsDeleteDialogOpen(false);
              }
            }}
            isDeleting={isDeleting}
          />
        </>
      )}
    </Card>
  );
}
