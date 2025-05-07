"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
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
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RemoveContentDialog } from "@/components/system-admin/reports/remove-content-dialog"
import { DismissReportDialog } from "@/components/system-admin/reports/dismiss-report-dialog"
import { use } from "react";

// Mock data for demonstration - in a real app, you would fetch this from an API
const reports = [
  {
    id: "RPT-1001",
    reportedBy: {
      name: "John Smith",
      email: "john.smith@example.com",
      avatar: "",
    },
    contentDescription: "Luxury Penthouse listing with misleading price information",
    propertyId: "PROP-28374",
    propertyTitle: "Luxury Penthouse with City Views",
    propertyImages: ["/placeholder.svg?height=400&width=600"],
    propertyDescription:
      "Stunning penthouse apartment with panoramic city views, 3 bedrooms, 2 bathrooms, and luxury amenities including a rooftop terrace.",
    dateReported: new Date(2023, 10, 15),
    status: "open",
    type: "price",
    comment: "The listing states $2,500/month but the actual price is $3,500/month when you inquire.",
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
    comment: "One of the photos shows inappropriate content that violates platform guidelines.",
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
]

export default function ReportDetailsPage({ params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter()
  const { id } = use(params);
  const [report, setReport] = useState<(typeof reports)[0] | null>(null)
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false)
  const [isDismissDialogOpen, setIsDismissDialogOpen] = useState(false)

  // Pagination state for notifications
  const [notificationsPage, setNotificationsPage] = useState(1)
  const notificationsPerPage = 5

  useEffect(() => {
    // In a real app, you would fetch the report data from an API
    const foundReport = reports.find((r) => r.id === id)
    setReport(foundReport || null)
  }, [id])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="outline" className="text-amber-600 bg-amber-50">
            Open
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="text-green-600 bg-green-50">
            Resolved
          </Badge>
        )
      case "dismissed":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Dismissed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getReportTypeBadge = (type: string) => {
    const types: Record<string, { color: string; bgColor: string }> = {
      price: { color: "text-blue-600", bgColor: "bg-blue-50" },
      inappropriate: { color: "text-red-600", bgColor: "bg-red-50" },
      inaccurate: { color: "text-amber-600", bgColor: "bg-amber-50" },
      discrimination: { color: "text-purple-600", bgColor: "bg-purple-50" },
      copyright: { color: "text-teal-600", bgColor: "bg-teal-50" },
      fraud: { color: "text-red-600", bgColor: "bg-red-50" },
      harassment: { color: "text-pink-600", bgColor: "bg-pink-50" },
      scam: { color: "text-orange-600", bgColor: "bg-orange-50" },
    }

    const style = types[type] || { color: "text-gray-600", bgColor: "bg-gray-50" }

    return (
      <Badge variant="outline" className={`${style.color} ${style.bgColor}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    )
  }

  // Calculate current page data for notifications
  const totalNotificationsPages = report?.notifications
    ? Math.ceil(report.notifications.length / notificationsPerPage)
    : 0
  const indexOfLastNotification = notificationsPage * notificationsPerPage
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage
  const currentNotifications = report?.notifications?.slice(indexOfFirstNotification, indexOfLastNotification) || []

  // Pagination controls for notifications
  const goToNextNotificationsPage = () => setNotificationsPage((prev) => Math.min(prev + 1, totalNotificationsPages))
  const goToPrevNotificationsPage = () => setNotificationsPage((prev) => Math.max(prev - 1, 1))

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-xl font-semibold">Report not found</h2>
        <Button variant="link" onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to reports
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Report Details</h1>
        <div className="ml-auto">
          {report.status === "open" && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setIsRemoveDialogOpen(true)}
              >
                <Ban className="h-4 w-4 mr-2" />
                Remove Content
              </Button>
              <Button variant="outline" onClick={() => setIsDismissDialogOpen(true)}>
                <X className="h-4 w-4 mr-2" />
                Dismiss Report
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Report Details */}
        <Card className="flex-1">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex gap-2 items-center mb-1">
                  <Flag className="h-4 w-4 text-amber-500" />
                  <CardTitle>Report {report.id}</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">
                  Reported on {format(report.dateReported, "MMMM d, yyyy")}
                </p>
              </div>
              <div className="flex flex-col items-end">
                {getStatusBadge(report.status)}
                <p className="text-xs text-muted-foreground mt-1">Property ID: {report.propertyId}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Report Type</h3>
              <div className="flex gap-2 items-center">{getReportTypeBadge(report.type)}</div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Reporter</h3>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{report.reportedBy.name}</p>
                  <a
                    href={`mailto:${report.reportedBy.email}`}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    <Mail className="h-3 w-3" />
                    {report.reportedBy.email}
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Report Comment</h3>
              <div className="bg-muted p-3 rounded-md">
                <div className="flex gap-2 items-start">
                  <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <p className="text-sm">{report.comment}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Owner */}
        <Card className="flex-1">
          <CardHeader>
            <div className="flex gap-2 items-center mb-1">
              <Building2 className="h-4 w-4 text-primary" />
              <CardTitle>Content Owner</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  <Building2 className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{report.contentOwner.name}</p>
                <p className="text-sm text-muted-foreground">Property Manager</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${report.contentOwner.email}`} className="text-sm text-primary hover:underline">
                  {report.contentOwner.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{report.contentOwner.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a
                  href={report.contentOwner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  {report.contentOwner.website.replace(/^https?:\/\//, "")}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reported Content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <Home className="h-4 w-4 text-primary" />
              <CardTitle>Reported Content</CardTitle>
            </div>
            <Badge variant="outline" className="text-muted-foreground">
              ID: {report.propertyId}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Property Details</h3>
              <div className="space-y-4">
                <p className="text-lg font-medium">{report.propertyTitle}</p>
                <p className="text-sm">{report.propertyDescription}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Property Image</h3>
              <div className="bg-muted rounded-md overflow-hidden">
                {report.propertyImages.length > 0 && (
                  <img
                    src={report.propertyImages[0] || "/placeholder.svg"}
                    alt="Property"
                    className="w-full h-auto object-cover"
                  />
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Report Issue</h3>
            <div className="bg-red-50 p-4 rounded-md">
              <div className="flex gap-2 items-start">
                <Info className="h-5 w-5 mt-0.5 text-red-500" />
                <div>
                  <p className="font-medium text-red-600">{report.contentDescription}</p>
                  <p className="text-sm text-red-600 mt-1">"{report.comment}"</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Log */}
      <Card>
        <CardHeader>
          <div className="flex gap-2 items-center">
            <Calendar className="h-4 w-4 text-primary" />
            <CardTitle>Notification Log</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {report.notifications.length === 0 ? (
            <div className="flex justify-center items-center p-8">
              <p className="text-muted-foreground">No notifications have been sent yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentNotifications.map((notification) => (
                <div key={notification.id} className="flex items-start gap-3 p-3 border rounded-md">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {notification.type === "acknowledgement" ? (
                          <span className="flex items-center gap-1">
                            <Check className="h-4 w-4 text-green-500" />
                            Acknowledgement
                          </span>
                        ) : notification.type === "resolution" ? (
                          <span className="flex items-center gap-1">
                            <Check className="h-4 w-4 text-green-500" />
                            Resolution
                          </span>
                        ) : (
                          notification.type
                        )}
                      </span>
                      <span className="text-sm text-muted-foreground">{format(notification.date, "MMM d, yyyy")}</span>
                    </div>
                    <p className="text-sm mt-1">To: {notification.recipient}</p>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  </div>
                </div>
              ))}

              {/* Notifications Pagination Controls */}
              {report.notifications.length > notificationsPerPage && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Showing <span className="font-medium">{indexOfFirstNotification + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastNotification, report.notifications.length)}
                    </span>{" "}
                    of <span className="font-medium">{report.notifications.length}</span> notifications
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPrevNotificationsPage}
                      disabled={notificationsPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Previous Page</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextNotificationsPage}
                      disabled={notificationsPage === totalNotificationsPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Next Page</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <RemoveContentDialog
        report={report}
        isOpen={isRemoveDialogOpen}
        onClose={() => setIsRemoveDialogOpen(false)}
        onRemove={() => {
          console.log(`Removing content for report ${report.id}`)
          setIsRemoveDialogOpen(false)
          router.back()
          // In a real application, you would call an API to remove the content
        }}
      />

      <DismissReportDialog
        report={report}
        isOpen={isDismissDialogOpen}
        onClose={() => setIsDismissDialogOpen(false)}
        onDismiss={(reason) => {
          console.log(`Dismissing report ${report.id} with reason: ${reason}`)
          setIsDismissDialogOpen(false)
          router.back()
          // In a real application, you would call an API to dismiss the report
        }}
      />
    </div>
  )
}
