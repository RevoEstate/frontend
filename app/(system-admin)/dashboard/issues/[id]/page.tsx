"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { format } from "date-fns"
import {
  ArrowLeft,
  ChevronDown,
  Clock,
  Download,
  File,
  MessageSquare,
  Paperclip,
  Send,
  User,
  Building2,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { use } from "react";

// Mock data for demonstration - in a real app, you would fetch this from an API
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
]

export default function IssueDetailsPage({ params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter()
  const { id } = use(params);
  const searchParams = useSearchParams()
  const [issue, setIssue] = useState<(typeof issues)[0] | null>(null)
  const [response, setResponse] = useState("")
  const [isResolved, setIsResolved] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messageEndRef = useRef<HTMLDivElement>(null)

  // Check if we should focus on the response form
  const shouldFocusResponse = searchParams.get("respond") === "true"

  useEffect(() => {
    // In a real app, you would fetch the issue data from an API
    const foundIssue = issues.find((i) => i.id === id)
    if (foundIssue) {
      setIssue(foundIssue)
      setIsResolved(foundIssue.status === "resolved")
    }
  }, [id])

  useEffect(() => {
    // Scroll to the bottom of the conversation when it changes
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [issue?.conversation])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setAttachments((prev) => [...prev, ...newFiles])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmitResponse = () => {
    if (!response.trim() && attachments.length === 0) return

    // In a real app, you would send this to your API
    console.log("Submitting response:", {
      issueId: issue?.id,
      message: response,
      attachments,
      isResolved,
    })

    // Clear the form
    setResponse("")
    setAttachments([])

    // Simulate adding the response to the conversation
    if (issue) {
      const newMessage = {
        id: `msg-${issue.conversation.length + 1}`,
        sender: "Support Team",
        senderType: "admin",
        message: response,
        timestamp: new Date(),
        attachments: attachments.map((file) => ({
          name: file.name,
          url: "#",
          size: `${Math.round(file.size / 1024)} KB`,
        })),
      }

      const updatedIssue = {
        ...issue,
        status: isResolved ? "resolved" : issue.status,
        conversation: [...issue.conversation, newMessage],
      }

      setIssue(updatedIssue)
    }
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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="outline" className="text-red-600 bg-red-50">
            High Priority
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="text-amber-600 bg-amber-50">
            Medium Priority
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="text-green-600 bg-green-50">
            Low Priority
          </Badge>
        )
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  if (!issue) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-xl font-semibold">Issue not found</h2>
        <Button variant="link" onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to issues
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
        <h1 className="text-2xl font-bold tracking-tight">Issue Details</h1>
      </div>

      {/* Issue Summary Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CardTitle>{issue.summary}</CardTitle>
                {getStatusBadge(issue.status)}
              </div>
              <p className="text-sm text-muted-foreground">
                Issue ID: {issue.id} • Raised on {format(issue.dateRaised, "MMMM d, yyyy")}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {getTypeBadge(issue.type)}
              {getPriorityBadge(issue.priority)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Raised By</h3>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {issue.raisedBy.type === "user" ? <User className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{issue.raisedBy.name}</p>
                  <p className="text-sm text-muted-foreground">{issue.raisedBy.email}</p>
                  <p className="text-xs text-muted-foreground">{issue.raisedBy.type === "user" ? "User" : "Company"}</p>
                </div>
              </div>
            </div>

            {issue.attachments.length > 0 && (
              <div className="flex-1">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Attachments</h3>
                <div className="space-y-2">
                  {issue.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center gap-2">
                        <File className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{attachment.name}</span>
                        <span className="text-xs text-muted-foreground">({attachment.size})</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Conversation Thread */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Conversation</CardTitle>
            <div className="flex items-center gap-2">
              <Label htmlFor="resolved" className="text-sm">
                Mark as Resolved
              </Label>
              <Switch
                id="resolved"
                checked={isResolved}
                onCheckedChange={setIsResolved}
                disabled={issue.status === "resolved"}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 max-h-[500px] overflow-y-auto mb-6">
            {issue.conversation.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.senderType === "admin" ? "flex-row-reverse" : ""}`}
              >
                <Avatar className="h-10 w-10 mt-0.5">
                  <AvatarFallback>
                    {message.senderType === "user" ? (
                      <User className="h-5 w-5" />
                    ) : message.senderType === "company" ? (
                      <Building2 className="h-5 w-5" />
                    ) : (
                      <MessageSquare className="h-5 w-5" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`flex-1 space-y-2 ${
                    message.senderType === "admin" ? "items-end text-right" : "items-start"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-medium ${message.senderType === "admin" ? "order-2" : ""}`}>
                      {message.sender}
                    </span>
                    <span
                      className={`text-xs text-muted-foreground flex items-center gap-1 ${
                        message.senderType === "admin" ? "order-1" : ""
                      }`}
                    >
                      <Clock className="h-3 w-3" />
                      {format(message.timestamp, "MMM d, h:mm a")}
                    </span>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      message.senderType === "admin"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                  </div>
                  {message.attachments.length > 0 && (
                    <div
                      className={`flex flex-col gap-2 ${message.senderType === "admin" ? "items-end" : "items-start"}`}
                    >
                      {message.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-2 p-2 rounded-md ${
                            message.senderType === "admin" ? "bg-primary/10" : "bg-muted"
                          }`}
                        >
                          <File className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{attachment.name}</span>
                          <span className="text-xs text-muted-foreground">({attachment.size})</span>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-2">
                            <Download className="h-3 w-3" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>

          {issue.status !== "resolved" && (
            <div className="space-y-4">
              <Separator />
              <h3 className="text-sm font-medium">Your Response</h3>
              <Textarea
                placeholder="Type your response here..."
                className="min-h-[120px]"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                autoFocus={shouldFocusResponse}
              />

              {/* Attachments */}
              {attachments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Attachments</h4>
                  <div className="space-y-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center gap-2">
                          <File className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-muted-foreground">({Math.round(file.size / 1024)} KB)</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500"
                          onClick={() => removeAttachment(index)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <div className="flex gap-2">
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" multiple />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1"
                  >
                    <Paperclip className="h-4 w-4" />
                    Attach Files
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        Templates
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() =>
                          setResponse(
                            "Thank you for reporting this issue. Our team is currently investigating and will get back to you shortly.",
                          )
                        }
                      >
                        Acknowledgement
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setResponse(
                            "We've identified the cause of the issue you reported and have implemented a fix. Please try again and let us know if you continue to experience any problems.",
                          )
                        }
                      >
                        Resolution
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setResponse(
                            "We need some additional information to help resolve your issue. Could you please provide more details about when this started happening and any error messages you're seeing?",
                          )
                        }
                      >
                        Request More Info
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Button onClick={handleSubmitResponse} className="flex items-center gap-1">
                  <Send className="h-4 w-4" />
                  Send Response
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
