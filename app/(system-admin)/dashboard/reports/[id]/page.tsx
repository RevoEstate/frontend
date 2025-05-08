"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  Ban,
  Building2,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Flag,
  Globe,
  Home,
  Info,
  Mail,
  MessageSquare,
  Phone,
  User,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RemoveContentDialog } from "@/components/system-admin/reports/remove-content-dialog";
import { DismissReportDialog } from "@/components/system-admin/reports/dismiss-report-dialog";
import { useReports } from "@/hooks/use-reports";
import { useReportsStore } from "@/store/reports";
import Link from "next/link";

// Mock data for demonstration - in a real app, you would fetch this from an API
const reports = [
  {
    id: "RPT-1001",
    reportedBy: {
      name: "John Smith",
      email: "john.smith@example.com",
      avatar: "",
    },
    contentDescription:
      "Luxury Penthouse listing with misleading price information",
    propertyId: "PROP-28374",
    propertyTitle: "Luxury Penthouse with City Views",
    propertyImages: ["/placeholder.svg?height=400&width=600"],
    propertyDescription:
      "Stunning penthouse apartment with panoramic city views, 3 bedrooms, 2 bathrooms, and luxury amenities including a rooftop terrace.",
    dateReported: new Date(2023, 10, 15),
    status: "open",
    type: "price",
    comment:
      "The listing states $2,500/month but the actual price is $3,500/month when you inquire.",
    contentOwner: {
      name: "Horizon Properties",
      email: "info@horizonproperties.com",
      phone: "(310) 555-6789",
      avatar: "",
      address: "456 Sunset Blvd, Los Angeles, CA 90028",
      website: "https://horizonproperties.com",
    },
    notifications: [
      {
        id: "1",
        date: new Date(2023, 10, 15),
        recipient: "John Smith",
        type: "acknowledgement",
        message: "Your report has been received and is under review.",
      },
    ],
  },
  {
    id: "RPT-1002",
    reportedBy: {
      name: "Maria Johnson",
      email: "maria.johnson@example.com",
      avatar: "",
    },
    contentDescription: "Beachfront villa with inappropriate content in photos",
    propertyId: "PROP-39485",
    propertyTitle: "Beachfront Villa with Private Pool",
    propertyImages: ["/placeholder.svg?height=400&width=600"],
    propertyDescription:
      "Luxurious beachfront villa with direct ocean access, 5 bedrooms, 4 bathrooms, private pool, and spacious outdoor entertainment area.",
    dateReported: new Date(2023, 10, 14),
    status: "open",
    type: "inappropriate",
    comment:
      "One of the photos shows inappropriate content that violates platform guidelines.",
    contentOwner: {
      name: "Coastal Realty",
      email: "contact@coastalrealty.com",
      phone: "(305) 555-8642",
      avatar: "",
      address: "333 Ocean Dr, Miami, FL 33139",
      website: "https://coastalrealty.com",
    },
    notifications: [
      {
        id: "1",
        date: new Date(2023, 10, 14),
        recipient: "Maria Johnson",
        type: "acknowledgement",
        message: "Your report has been received and is under review.",
      },
    ],
  },
];

export default function ReportDetailsPage() {
  const params = useParams();
  const reportId = params.id as string;
  const { reports, isLoading } = useReports();
  const { setSelectedReport } = useReportsStore();
  const [isDismissDialogOpen, setIsDismissDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

  const report = reports?.data?.reports.find((r) => r.reportId === reportId);

  useEffect(() => {
    if (report) {
      setSelectedReport(report);
    }
  }, [report, setSelectedReport]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          <div className="space-y-4">
            <div className="h-24 bg-muted animate-pulse rounded" />
            <div className="h-48 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-6">
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
          <Link href="/dashboard/reports">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Reports
            </Button>
          </Link>
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <h2 className="text-lg font-semibold">Report Not Found</h2>
                <p className="text-muted-foreground mt-1">
                  The report you are looking for does not exist or has been
                  deleted.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <Link href="/dashboard/reports">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Reports
            </Button>
          </Link>

          {report.status === "open" && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setIsDismissDialogOpen(true)}
              >
                <X className="h-4 w-4" />
                Dismiss Report
              </Button>
              <Button
                variant="destructive"
                className="gap-2"
                onClick={() => setIsRemoveDialogOpen(true)}
              >
                <Ban className="h-4 w-4" />
                Remove Content
              </Button>
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Report Details</CardTitle>
              {getStatusBadge(report.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Report ID</p>
                <p className="font-medium">{report.reportId}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Date Reported</p>
                <p className="font-medium">
                  {format(new Date(report.createdAt), "PPP")}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Reason</p>
                <p className="font-medium">{report.reason}</p>
              </div>
              {report.notes && (
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="font-medium">{report.notes}</p>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold">Reported Property</h3>
              <div className="rounded-lg border p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">
                      {report.property?.title || "Unknown Property"}
                    </h4>
                    <Link
                      href={`/properties/${report.propertyId}`}
                      target="_blank"
                    >
                      <Button variant="ghost" size="sm">
                        View Property
                      </Button>
                    </Link>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ID: {report.propertyId}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="font-semibold">Reporter</h3>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {report.reporter?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {`${report.reporter?.name || ""}`?.trim() || "Unknown"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {report.reporter?.email || "No email"}
                    </p>
                  </div>
                </div>
              </div>

              {report.resolvedBy && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Resolved By</h3>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {report.resolver?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {`${report.resolver?.name || ""}`?.trim() || "Unknown"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {report.resolver?.email || "No email"}
                      </p>
                      {report.resolvedAt && (
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(report.resolvedAt), "PPP")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <DismissReportDialog
        open={isDismissDialogOpen}
        onOpenChange={setIsDismissDialogOpen}
      />
      <RemoveContentDialog
        open={isRemoveDialogOpen}
        onOpenChange={setIsRemoveDialogOpen}
      />
    </div>
  );
}
