"use client";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePackages } from "@/hooks/usePackages";
import usePackageStore from "@/store/packageStore";
import { useDeletePackage } from "@/hooks/useDeletePackage";
import { useState } from "react";
import { toast } from "sonner";

export default function PackagesTable() {
  const router = useRouter();
  const [packageToDelete, setPackageToDelete] = useState<string | null>(null);
  const { filter, sort, pagination, setSort, setPage } = usePackageStore();
  const { packages, total, isLoading, error } = usePackages(
    filter,
    sort,
    pagination
  );
  const { deletePackage, isDeleting, error: deleteError } = useDeletePackage();

  // Calculate total pages
  const totalPages = Math.ceil(total / pagination.limit);

  // Handle sort change
  const handleSortChange = (field: string) => {
    if (sort.field === field) {
      // Toggle direction if same field
      setSort({
        field,
        direction: sort.direction === "asc" ? "desc" : "asc",
      });
    } else {
      // Default to desc for new field
      setSort({
        field,
        direction: "desc",
      });
    }
  };

  // Get sort indicator
  const getSortIndicator = (field: string) => {
    if (sort.field !== field) return null;
    return sort.direction === "asc" ? " ↑" : " ↓";
  };

  // Format currency
  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency === "usd" ? "USD" : "ETB",
      minimumFractionDigits: 2,
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Error loading packages: {error}</div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="w-[200px] cursor-pointer"
              onClick={() => handleSortChange("packageName")}
            >
              Package Name{getSortIndicator("packageName")}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSortChange("packageType")}
            >
              Type{getSortIndicator("packageType")}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSortChange("packagePrice.usd")}
            >
              Price (USD){getSortIndicator("packagePrice.usd")}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSortChange("packageDuration")}
            >
              Duration{getSortIndicator("packageDuration")}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSortChange("numberOfProperties")}
            >
              Properties{getSortIndicator("numberOfProperties")}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSortChange("createdAt")}
            >
              Created{getSortIndicator("createdAt")}
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No packages found.
              </TableCell>
            </TableRow>
          ) : (
            packages.map((pkg) => (
              <TableRow key={pkg._id}>
                <TableCell className="font-medium">{pkg.packageName}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      pkg.packageType === "premium" ? "default" : "outline"
                    }
                  >
                    {pkg.packageType.charAt(0).toUpperCase() +
                      pkg.packageType.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          {formatCurrency(pkg.packagePrice.usd, "usd")}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{formatCurrency(pkg.packagePrice.etb, "etb")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>{pkg.packageDuration} months</TableCell>
                <TableCell>{pkg.numberOfProperties}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(pkg.createdAt), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/dashboard/packages/${pkg._id}`)
                        }
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/dashboard/packages/${pkg._id}/edit`)
                        }
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Package
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {packages.length} of {total} packages
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, pagination.page - 1))}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <div className="text-sm">
              Page {pagination.page} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(totalPages, pagination.page + 1))}
              disabled={pagination.page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!packageToDelete}
        onOpenChange={() => setPackageToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              package and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!packageToDelete) return;

                deletePackage(packageToDelete, {
                  onSuccess: () => {
                    toast.success("Package deleted successfully");
                    setPackageToDelete(null);
                  },
                  onError: (error) => {
                    toast.error("Failed to delete package. Please try again.");
                    setPackageToDelete(null);
                  },
                });
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Deleting...
                </div>
              ) : (
                "Delete Package"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
