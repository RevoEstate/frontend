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

// Mock data for demonstration
const subAccounts = [
  {
    id: "SA-1001",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Manager",
    status: "active",
    lastLogin: new Date(2023, 10, 15, 14, 30),
    permissions: ["Approve Listings", "View Reports", "Manage Content"],
  },
  {
    id: "SA-1002",
    name: "Maria Johnson",
    email: "maria.johnson@example.com",
    role: "Sub-Admin",
    status: "active",
    lastLogin: new Date(2023, 10, 14, 9, 45),
    permissions: ["Approve Listings", "View Reports", "Manage Users", "Manage Content", "Access Analytics"],
  },
  {
    id: "SA-1003",
    name: "Robert Wilson",
    email: "robert.wilson@example.com",
    role: "Support",
    status: "inactive",
    lastLogin: new Date(2023, 10, 10, 11, 20),
    permissions: ["View Reports", "Manage Content"],
  },
  {
    id: "SA-1004",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "Content Moderator",
    status: "active",
    lastLogin: new Date(2023, 10, 15, 10, 15),
    permissions: ["Manage Content"],
  },
  {
    id: "SA-1005",
    name: "David Brown",
    email: "david.brown@example.com",
    role: "Manager",
    status: "active",
    lastLogin: new Date(2023, 10, 14, 16, 45),
    permissions: ["Approve Listings", "View Reports", "Manage Content", "Access Analytics"],
  },
  {
    id: "SA-1006",
    name: "Sarah Miller",
    email: "sarah.miller@example.com",
    role: "Sub-Admin",
    status: "active",
    lastLogin: new Date(2023, 10, 13, 13, 30),
    permissions: [
      "Approve Listings",
      "View Reports",
      "Manage Users",
      "Manage Content",
      "Access Analytics",
      "Manage Payments",
    ],
  },
  {
    id: "SA-1007",
    name: "Michael Taylor",
    email: "michael.taylor@example.com",
    role: "Support",
    status: "active",
    lastLogin: new Date(2023, 10, 12, 9, 10),
    permissions: ["View Reports", "Manage Content"],
  },
  {
    id: "SA-1008",
    name: "Jennifer White",
    email: "jennifer.white@example.com",
    role: "Content Moderator",
    status: "inactive",
    lastLogin: new Date(2023, 10, 8, 14, 20),
    permissions: ["Manage Content"],
  },
  {
    id: "SA-1009",
    name: "James Anderson",
    email: "james.anderson@example.com",
    role: "Manager",
    status: "active",
    lastLogin: new Date(2023, 10, 15, 8, 45),
    permissions: ["Approve Listings", "View Reports", "Manage Content", "Access Analytics"],
  },
  {
    id: "SA-1010",
    name: "Lisa Martin",
    email: "lisa.martin@example.com",
    role: "Sub-Admin",
    status: "active",
    lastLogin: new Date(2023, 10, 14, 11, 30),
    permissions: ["Approve Listings", "View Reports", "Manage Users", "Manage Content", "Access Analytics"],
  },
]

export function SubAccountsTable() {
  const router = useRouter()
  const [selectedAccount, setSelectedAccount] = useState<(typeof subAccounts)[0] | null>(null)
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 7
  const totalPages = Math.ceil(subAccounts.length / rowsPerPage)

  const handleEditAccount = (account: (typeof subAccounts)[0]) => {
    router.push(`/dashboard/sub-accounts/${account.id}`)
  }

  const handleDeactivateAccount = (account: (typeof subAccounts)[0]) => {
    setSelectedAccount(account)
    setIsDeactivateDialogOpen(true)
  }

  const handleDeleteAccount = (account: (typeof subAccounts)[0]) => {
    setSelectedAccount(account)
    setIsDeleteDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="text-green-600 bg-green-50">
            Active
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="outline" className="text-red-600 bg-red-50">
            Inactive
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Manager":
        return (
          <div className="flex items-center gap-1">
            <Shield className="h-3.5 w-3.5 text-blue-500" />
            <span>{role}</span>
          </div>
        )
      case "Sub-Admin":
        return (
          <div className="flex items-center gap-1">
            <ShieldAlert className="h-3.5 w-3.5 text-purple-500" />
            <span>{role}</span>
          </div>
        )
      case "Support":
        return (
          <div className="flex items-center gap-1">
            <ShieldOff className="h-3.5 w-3.5 text-green-500" />
            <span>{role}</span>
          </div>
        )
      case "Content Moderator":
        return (
          <div className="flex items-center gap-1">
            <ShieldOff className="h-3.5 w-3.5 text-amber-500" />
            <span>{role}</span>
          </div>
        )
      default:
        return <span>{role}</span>
    }
  }

  // Calculate the current page's data
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentAccounts = subAccounts.slice(indexOfFirstRow, indexOfLastRow)

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
                  <TableCell isHeader className="w-[60px]">#</TableCell>
                  <TableCell isHeader>Name</TableCell>
                  <TableCell isHeader>Email</TableCell>
                  <TableCell isHeader>Role</TableCell>
                  <TableCell isHeader>Status</TableCell>
                  <TableCell isHeader>Last Login</TableCell>
                  <TableCell isHeader className="text-right">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentAccounts.map((account, index) => (
                  <TableRow key={account.id} className="group hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium text-muted-foreground">{indexOfFirstRow + index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{account.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{account.name}</p>
                          <p className="text-xs text-muted-foreground">ID: {account.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>{getRoleBadge(account.role)}</TableCell>
                    <TableCell>{getStatusBadge(account.status)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{format(account.lastLogin, "MMM d, yyyy")}</span>
                        <span className="text-xs text-muted-foreground">{format(account.lastLogin, "h:mm a")}</span>
                      </div>
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
                            <DropdownMenuItem onClick={() => handleEditAccount(account)}>
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
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{indexOfFirstRow + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastRow, subAccounts.length)}</span> of{" "}
              <span className="font-medium">{subAccounts.length}</span> accounts
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

      {selectedAccount && (
        <>
          <DeactivateAccountDialog
            account={selectedAccount}
            isOpen={isDeactivateDialogOpen}
            onClose={() => setIsDeactivateDialogOpen(false)}
            onDeactivate={() => {
              console.log(`Deactivating account ${selectedAccount.id}`)
              setIsDeactivateDialogOpen(false)
              // In a real application, you would call an API to deactivate the account
            }}
          />

          <DeleteAccountDialog
            account={selectedAccount}
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onDelete={() => {
              console.log(`Deleting account ${selectedAccount.id}`)
              setIsDeleteDialogOpen(false)
              // In a real application, you would call an API to delete the account
            }}
          />
        </>
      )}
    </Card>
  )
}
