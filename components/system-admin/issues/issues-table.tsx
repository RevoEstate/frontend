"use client"

import { useState } from "react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Eye, MessageSquare, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Mock data for demonstration
const issues = [
  {
    id: "ISS-1001",
    raisedBy: {
      name: "John Smith",
      email: "john.smith@example.com",
      avatar: "",
      type: "user",
    },
    summary: "Unable to upload property images",
    description:
      "I've been trying to upload images for my new property listing but keep getting an error message saying 'File upload failed'. I've tried different image sizes and formats but nothing works.",
    dateRaised: new Date(2023, 10, 15),
    status: "open",
    type: "technical",
    priority: "high",
    attachments: [
      { name: "error-screenshot.png", url: "#", size: "245 KB" },
      { name: "browser-console.txt", url: "#", size: "12 KB" },
    ],
    conversation: [
      {
        id: "msg-1",
        sender: "John Smith",
        senderType: "user",
        message:
          "I've been trying to upload images for my new property listing but keep getting an error message saying 'File upload failed'. I've tried different image sizes and formats but nothing works.",
        timestamp: new Date(2023, 10, 15, 10, 30),
        attachments: [
          { name: "error-screenshot.png", url: "#", size: "245 KB" },
          { name: "browser-console.txt", url: "#", size: "12 KB" },
        ],
      },
    ],
  },
  {
    id: "ISS-1002",
    raisedBy: {
      name: "Horizon Properties",
      email: "support@horizonproperties.com",
      avatar: "",
      type: "company",
    },
    summary: "Payment processing delay",
    description:
      "We processed a payment for our premium listing subscription 3 days ago, but it's still showing as 'pending' in our account. The funds have been deducted from our bank account but the subscription hasn't been activated.",
    dateRaised: new Date(2023, 10, 14),
    status: "in-progress",
    type: "payment",
    priority: "high",
    attachments: [{ name: "payment-receipt.pdf", url: "#", size: "156 KB" }],
    conversation: [
      {
        id: "msg-1",
        sender: "Horizon Properties",
        senderType: "company",
        message:
          "We processed a payment for our premium listing subscription 3 days ago, but it's still showing as 'pending' in our account. The funds have been deducted from our bank account but the subscription hasn't been activated.",
        timestamp: new Date(2023, 10, 14, 14, 15),
        attachments: [{ name: "payment-receipt.pdf", url: "#", size: "156 KB" }],
      },
      {
        id: "msg-2",
        sender: "Support Team",
        senderType: "admin",
        message:
          "Thank you for reporting this issue. I can see the payment in our system but it appears to be stuck in processing. I've escalated this to our finance team and they'll resolve it within 24 hours. I'll update you once it's fixed.",
        timestamp: new Date(2023, 10, 14, 15, 45),
        attachments: [],
      },
    ],
  },
  {
    id: "ISS-1003",
    raisedBy: {
      name: "Maria Johnson",
      email: "maria.johnson@example.com",
      avatar: "",
      type: "user",
    },
    summary: "Incorrect property details displayed",
    description:
      "I noticed that the square footage for my property listing (Property ID: PROP-39485) is showing incorrectly. I entered 1,850 sq ft but it's displaying as 1,580 sq ft on the public listing.",
    dateRaised: new Date(2023, 10, 12),
    status: "resolved",
    type: "listing",
    priority: "medium",
    attachments: [],
    conversation: [
      {
        id: "msg-1",
        sender: "Maria Johnson",
        senderType: "user",
        message:
          "I noticed that the square footage for my property listing (Property ID: PROP-39485) is showing incorrectly. I entered 1,850 sq ft but it's displaying as 1,580 sq ft on the public listing.",
        timestamp: new Date(2023, 10, 12, 9, 20),
        attachments: [],
      },
      {
        id: "msg-2",
        sender: "Support Team",
        senderType: "admin",
        message:
          "Thank you for bringing this to our attention. I've checked your listing and can confirm there was a display error. I've corrected the square footage to show 1,850 sq ft as you entered. The change should be visible now. Please let me know if you notice any other discrepancies.",
        timestamp: new Date(2023, 10, 12, 11, 45),
        attachments: [],
      },
      {
        id: "msg-3",
        sender: "Maria Johnson",
        senderType: "user",
        message: "Thank you! I checked and it's displaying correctly now.",
        timestamp: new Date(2023, 10, 12, 13, 10),
        attachments: [],
      },
    ],
  },
  {
    id: "ISS-1004",
    raisedBy: {
      name: "Robert Wilson",
      email: "robert.wilson@example.com",
      avatar: "",
      type: "user",
    },
    summary: "Account verification issue",
    description:
      "I submitted my ID verification documents 5 days ago but my account is still showing as 'unverified'. I need to post a listing urgently but can't proceed without verification.",
    dateRaised: new Date(2023, 10, 10),
    status: "open",
    type: "account",
    priority: "high",
    attachments: [],
    conversation: [
      {
        id: "msg-1",
        sender: "Robert Wilson",
        senderType: "user",
        message:
          "I submitted my ID verification documents 5 days ago but my account is still showing as 'unverified'. I need to post a listing urgently but can't proceed without verification.",
        timestamp: new Date(2023, 10, 10, 16, 30),
        attachments: [],
      },
    ],
  },
  {
    id: "ISS-1005",
    raisedBy: {
      name: "Coastal Realty",
      email: "info@coastalrealty.com",
      avatar: "",
      type: "company",
    },
    summary: "Bulk listing upload failure",
    description:
      "We tried to use the bulk upload feature to add 20 new properties, but the system only processed 12 of them. The remaining 8 properties weren't added and we didn't receive any error message.",
    dateRaised: new Date(2023, 10, 8),
    status: "in-progress",
    type: "technical",
    priority: "medium",
    attachments: [{ name: "properties-spreadsheet.xlsx", url: "#", size: "345 KB" }],
    conversation: [
      {
        id: "msg-1",
        sender: "Coastal Realty",
        senderType: "company",
        message:
          "We tried to use the bulk upload feature to add 20 new properties, but the system only processed 12 of them. The remaining 8 properties weren't added and we didn't receive any error message.",
        timestamp: new Date(2023, 10, 8, 11, 15),
        attachments: [{ name: "properties-spreadsheet.xlsx", url: "#", size: "345 KB" }],
      },
      {
        id: "msg-2",
        sender: "Support Team",
        senderType: "admin",
        message:
          "Thank you for reporting this issue. I've reviewed your spreadsheet and found that the 8 properties that failed to upload had missing required fields (specifically the property type and number of bedrooms). I'm attaching a revised spreadsheet with the issues highlighted. Please complete these fields and try the upload again.",
        timestamp: new Date(2023, 10, 8, 14, 30),
        attachments: [{ name: "revised-spreadsheet.xlsx", url: "#", size: "348 KB" }],
      },
    ],
  },
  {
    id: "ISS-1006",
    raisedBy: {
      name: "Emily Davis",
      email: "emily.davis@example.com",
      avatar: "",
      type: "user",
    },
    summary: "Cannot schedule property viewing",
    description:
      "I'm trying to schedule a viewing for property ID PROP-67890 but keep getting an error message saying 'Scheduling unavailable at this time'. I've tried different dates and times but nothing works.",
    dateRaised: new Date(2023, 10, 6),
    status: "resolved",
    type: "technical",
    priority: "medium",
    attachments: [],
    conversation: [
      {
        id: "msg-1",
        sender: "Emily Davis",
        senderType: "user",
        message:
          "I'm trying to schedule a viewing for property ID PROP-67890 but keep getting an error message saying 'Scheduling unavailable at this time'. I've tried different dates and times but nothing works.",
        timestamp: new Date(2023, 10, 6, 9, 45),
        attachments: [],
      },
      {
        id: "msg-2",
        sender: "Support Team",
        senderType: "admin",
        message:
          "I apologize for the inconvenience. We identified a technical issue with our scheduling system that affected some properties. Our team has resolved the issue, and you should now be able to schedule viewings without any problems. Please try again and let us know if you encounter any further issues.",
        timestamp: new Date(2023, 10, 6, 11, 20),
        attachments: [],
      },
      {
        id: "msg-3",
        sender: "Emily Davis",
        senderType: "user",
        message: "It's working now. Thank you for the quick resolution!",
        timestamp: new Date(2023, 10, 6, 12, 5),
        attachments: [],
      },
    ],
  },
  {
    id: "ISS-1007",
    raisedBy: {
      name: "David Brown",
      email: "david.brown@example.com",
      avatar: "",
      type: "user",
    },
    summary: "Incorrect billing amount",
    description:
      "I was charged $149 for my premium listing, but the advertised price was $99. Please refund the difference or explain why I was charged more.",
    dateRaised: new Date(2023, 10, 4),
    status: "open",
    type: "payment",
    priority: "high",
    attachments: [{ name: "invoice.pdf", url: "#", size: "125 KB" }],
    conversation: [
      {
        id: "msg-1",
        sender: "David Brown",
        senderType: "user",
        message:
          "I was charged $149 for my premium listing, but the advertised price was $99. Please refund the difference or explain why I was charged more.",
        timestamp: new Date(2023, 10, 4, 15, 30),
        attachments: [{ name: "invoice.pdf", url: "#", size: "125 KB" }],
      },
    ],
  },
  {
    id: "ISS-1008",
    raisedBy: {
      name: "Sarah Miller",
      email: "sarah.miller@example.com",
      avatar: "",
      type: "user",
    },
    summary: "Feature request: Virtual tours",
    description:
      "I would like to suggest adding support for 360° virtual tours to property listings. This would be extremely valuable for remote buyers and would help my properties stand out.",
    dateRaised: new Date(2023, 10, 2),
    status: "in-progress",
    type: "other",
    priority: "low",
    attachments: [],
    conversation: [
      {
        id: "msg-1",
        sender: "Sarah Miller",
        senderType: "user",
        message:
          "I would like to suggest adding support for 360° virtual tours to property listings. This would be extremely valuable for remote buyers and would help my properties stand out.",
        timestamp: new Date(2023, 10, 2, 10, 15),
        attachments: [],
      },
      {
        id: "msg-2",
        sender: "Product Team",
        senderType: "admin",
        message:
          "Thank you for your suggestion! We actually have virtual tour support on our product roadmap for Q1 next year. We're currently in the development phase and will be launching a beta version in about 6-8 weeks. Would you be interested in participating in our beta testing program?",
        timestamp: new Date(2023, 10, 2, 14, 45),
        attachments: [],
      },
    ],
  },
  {
    id: "ISS-1009",
    raisedBy: {
      name: "Metro Housing Solutions",
      email: "support@metrohousing.com",
      avatar: "",
      type: "company",
    },
    summary: "API integration issues",
    description:
      "We're trying to integrate our property management system with your API but are encountering authentication errors. We've followed the documentation but still can't get it working.",
    dateRaised: new Date(2023, 10, 1),
    status: "open",
    type: "technical",
    priority: "medium",
    attachments: [{ name: "error-logs.txt", url: "#", size: "78 KB" }],
    conversation: [
      {
        id: "msg-1",
        sender: "Metro Housing Solutions",
        senderType: "company",
        message:
          "We're trying to integrate our property management system with your API but are encountering authentication errors. We've followed the documentation but still can't get it working.",
        timestamp: new Date(2023, 10, 1, 11, 30),
        attachments: [{ name: "error-logs.txt", url: "#", size: "78 KB" }],
      },
    ],
  },
  {
    id: "ISS-1010",
    raisedBy: {
      name: "James Anderson",
      email: "james.anderson@example.com",
      avatar: "",
      type: "user",
    },
    summary: "Search functionality not working",
    description:
      "When I try to search for properties with specific criteria (3+ bedrooms in Chicago under $500k), the search results are either empty or show irrelevant listings. This has been happening for the past 2 days.",
    dateRaised: new Date(2023, 9, 28),
    status: "resolved",
    type: "technical",
    priority: "high",
    attachments: [],
    conversation: [
      {
        id: "msg-1",
        sender: "James Anderson",
        senderType: "user",
        message:
          "When I try to search for properties with specific criteria (3+ bedrooms in Chicago under $500k), the search results are either empty or show irrelevant listings. This has been happening for the past 2 days.",
        timestamp: new Date(2023, 9, 28, 9, 15),
        attachments: [],
      },
      {
        id: "msg-2",
        sender: "Support Team",
        senderType: "admin",
        message:
          "Thank you for reporting this issue. Our team has identified a bug in our search algorithm that was affecting searches with multiple criteria. We've deployed a fix, and the search functionality should now be working correctly. Please try your search again and let us know if you continue to experience any issues.",
        timestamp: new Date(2023, 9, 28, 13, 40),
        attachments: [],
      },
      {
        id: "msg-3",
        sender: "James Anderson",
        senderType: "user",
        message: "The search is working perfectly now. Thanks for the quick fix!",
        timestamp: new Date(2023, 9, 28, 14, 25),
        attachments: [],
      },
    ],
  },
]

export function IssuesTable() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 7
  const totalPages = Math.ceil(issues.length / rowsPerPage)

  const handleViewDetails = (issue: (typeof issues)[0]) => {
    router.push(`/dashboard/issues/${issue.id}`)
  }

  const handleRespond = (issue: (typeof issues)[0]) => {
    router.push(`/dashboard/issues/${issue.id}?respond=true`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="outline" className="text-amber-600 bg-amber-50">
            Open
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="text-blue-600 bg-blue-50">
            In Progress
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="text-green-600 bg-green-50">
            Resolved
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    const types: Record<string, { color: string; bgColor: string }> = {
      technical: { color: "text-purple-600", bgColor: "bg-purple-50" },
      listing: { color: "text-blue-600", bgColor: "bg-blue-50" },
      payment: { color: "text-green-600", bgColor: "bg-green-50" },
      account: { color: "text-orange-600", bgColor: "bg-orange-50" },
      other: { color: "text-gray-600", bgColor: "bg-gray-50" },
    }

    const style = types[type] || { color: "text-gray-600", bgColor: "bg-gray-50" }

    return (
      <Badge variant="outline" className={`${style.color} ${style.bgColor}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    )
  }

  // Calculate the current page's data
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentIssues = issues.slice(indexOfFirstRow, indexOfLastRow)

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
                  <TableCell isHeader className="w-[80px]">Issue ID</TableCell>
                  <TableCell isHeader>Raised By</TableCell>
                  <TableCell isHeader className="hidden md:table-cell">Issue Summary</TableCell>
                  <TableCell isHeader>Date Raised</TableCell>
                  <TableCell isHeader>Status</TableCell>
                  <TableCell isHeader>Type</TableCell>
                  <TableCell isHeader className="text-right">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentIssues.map((issue) => (
                  <TableRow key={issue.id} className="group hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{issue.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback>{issue.raisedBy.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="hidden sm:block">
                          <p className="text-sm font-medium">{issue.raisedBy.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {issue.raisedBy.type === "user" ? "User" : "Company"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                      <p className="text-sm truncate">{issue.summary}</p>
                    </TableCell>
                    <TableCell>{format(issue.dateRaised, "MMM d, yyyy")}</TableCell>
                    <TableCell>{getStatusBadge(issue.status)}</TableCell>
                    <TableCell>{getTypeBadge(issue.type)}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleViewDetails(issue)}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            {issue.status !== "resolved" && (
                              <DropdownMenuItem onClick={() => handleRespond(issue)}>
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
              Showing <span className="font-medium">{indexOfFirstRow + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastRow, issues.length)}</span> of{" "}
              <span className="font-medium">{issues.length}</span> issues
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
    </Card>
  )
}
