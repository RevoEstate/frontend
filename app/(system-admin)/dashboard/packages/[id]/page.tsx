"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Edit,
  Package,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { usePackage } from "@/hooks/usePackage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DeletePackageDialog } from "@/components/system-admin/packages/delete-package-dialog";
import { use } from "react";

export default function PackageDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const { package: packageData, isLoading, error } = usePackage(id);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-red-500 text-lg">
          Error loading package: {error}
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/packages")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Packages
        </Button>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-lg">Package not found</div>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/packages")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Packages
        </Button>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency === "usd" ? "USD" : "ETB",
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/packages")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {packageData.packageName}
          </h1>
          <Badge
            variant={
              packageData.packageType === "premium" ? "default" : "outline"
            }
          >
            {packageData.packageType.charAt(0).toUpperCase() +
              packageData.packageType.slice(1)}
          </Badge>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/dashboard/packages/${id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Package Details</CardTitle>
            <CardDescription>
              Basic information about this package
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Package Name</p>
              <p className="text-lg">{packageData.packageName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Created At</p>
              <p className="text-lg">
                {format(new Date(packageData.createdAt), "PPP")}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Last Updated</p>
              <p className="text-lg">
                {format(new Date(packageData.updatedAt), "PPP")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Package Specifications</CardTitle>
            <CardDescription>Key features and specifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Price (USD)</p>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-muted-foreground mr-1" />
                  <p className="text-lg">
                    {formatCurrency(packageData.packagePrice.usd, "usd")}
                  </p>
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Price (ETB)</p>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-muted-foreground mr-1" />
                  <p className="text-lg">
                    {formatCurrency(packageData.packagePrice.etb, "etb")}
                  </p>
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Duration</p>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-muted-foreground mr-1" />
                  <p className="text-lg">
                    {packageData.packageDuration} months
                  </p>
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Properties</p>
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-muted-foreground mr-1" />
                  <p className="text-lg">{packageData.numberOfProperties}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Package Description</CardTitle>
          <CardDescription>Detailed description of the package</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">
            {packageData.packageDescription}
          </p>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      {packageData && (
        <DeletePackageDialog
          packageId={id}
          packageName={packageData.packageName}
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
        />
      )}
    </div>
  );
}
