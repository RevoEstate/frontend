"use client"

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  useIssue,
  useRespondToIssue,
  useResolveIssue,
} from "@/hooks/useIssues";
import { IssueStatus, IssueType, IssuePriority } from "@/types/issue";
import { use } from "react";

export default function IssueDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const searchParams = useSearchParams();
  const [response, setResponse] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isResolved, setIsResolved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Fetch issue data
  const { data: issueData, isLoading, isError } = useIssue(id);
  console.log("issueData", issueData);
  const { mutate: respondToIssue, isPending: isResponding } =
    useRespondToIssue();
  const { mutate: resolveIssue, isPending: isResolving } = useResolveIssue();

  // Check if we should focus on the response form
  const shouldFocusResponse = searchParams.get("respond") === "true";

  useEffect(() => {
    // Scroll to the bottom of the conversation when it changes
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [issueData?.data.conversation]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitResponse = () => {
    if (!response.trim() && attachments.length === 0) return;

    if (isResolved) {
      resolveIssue({
        issueId: id,
        data: { resolutionMessage: response },
      });
    } else {
      respondToIssue({
        issueId: id,
        data: { message: response, attachments },
      });
    }

    // Clear the form
    setResponse("");
    setAttachments([]);
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
      payment: { color: "text-green-600", bgColor: "bg-green-50" },
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

  const getPriorityBadge = (priority: IssuePriority) => {
    switch (priority) {
      case "urgent":
        return (
          <Badge variant="outline" className="text-red-600 bg-red-50">
            Urgent
          </Badge>
        );
      case "high":
        return (
          <Badge variant="outline" className="text-red-600 bg-red-50">
            High Priority
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="outline" className="text-amber-600 bg-amber-50">
            Medium Priority
          </Badge>
        );
      case "low":
        return (
          <Badge variant="outline" className="text-green-600 bg-green-50">
            Low Priority
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-5xl py-6">
        <Card>
          <CardContent className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !issueData) {
    return (
      <div className="container max-w-5xl py-6">
        <Card>
          <CardContent className="flex justify-center items-center min-h-[400px]">
            <p className="text-destructive">
              Failed to load issue details. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const issue = issueData.data;

  return (
    <div className="container max-w-5xl py-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.push("/dashboard/issues")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Issues
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-2">
              Issue #{issue.issueId}
            </h1>
            <p className="text-muted-foreground mb-4">{issue.summary}</p>
            <div className="flex gap-2 flex-wrap">
              {getStatusBadge(issue.status)}
              {getTypeBadge(issue.type)}
              {getPriorityBadge(issue.priority)}
            </div>
          </div>
          <div className="text-sm text-muted-foreground text-right">
            <p>Raised on {format(new Date(issue.dateRaised), "MMM d, yyyy")}</p>
            <p>
              Last updated {format(new Date(issue.lastUpdated), "MMM d, yyyy")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Issue Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <Avatar className="mt-1">
                  {issue.raisedBy.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={issue.raisedBy.avatar}
                      alt={issue.raisedBy.name}
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback>
                      {issue.raisedBy.type === "company" ? (
                        <Building2 className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{issue.raisedBy.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {issue.raisedBy.email}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 space-y-4">
                    <p>{issue.description}</p>
                    {issue.attachments.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Attachments:</p>
                        <div className="space-y-2">
                          {issue.attachments.map((attachment, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 text-sm"
                            >
                              <File className="h-4 w-4" />
                              <a
                                href={attachment.url}
                                className="text-primary hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {attachment.name}
                              </a>
                              <span className="text-muted-foreground">
                                ({attachment.size})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conversation */}
          <Card>
            <CardHeader>
              <CardTitle>Conversation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {issue.conversation.map((message) => (
                  <div key={message.id} className="flex items-start gap-4">
                    <Avatar>
                      {message.sender.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={message.sender.avatar}
                          alt={message.sender.name}
                          className="object-cover"
                        />
                      ) : (
                        <AvatarFallback>
                          {message.sender.type === "company" ? (
                            <Building2 className="h-4 w-4" />
                          ) : message.sender.type === "admin" ? (
                            <MessageSquare className="h-4 w-4" />
                          ) : (
                            <User className="h-4 w-4" />
                          )}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{message.sender.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(
                              new Date(message.timestamp),
                              "MMM d, yyyy 'at' h:mm a"
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 space-y-4">
                        <p>{message.message}</p>
                        {message.attachments.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">
                              Attachments:
                            </p>
                            <div className="space-y-2">
                              {message.attachments.map((attachment, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <File className="h-4 w-4" />
                                  <a
                                    href={attachment.url}
                                    className="text-primary hover:underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {attachment.name}
                                  </a>
                                  <span className="text-muted-foreground">
                                    ({attachment.size})
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messageEndRef} />
              </div>

              {/* Response Form */}
              {issue.status !== "resolved" && issue.status !== "closed" && (
                <div className="mt-6 space-y-4">
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="resolve"
                        checked={isResolved}
                        onCheckedChange={setIsResolved}
                      />
                      <Label htmlFor="resolve">Mark as resolved</Label>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Type your response..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    className="min-h-[100px]"
                    autoFocus={shouldFocusResponse}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        multiple
                        onChange={handleFileUpload}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Paperclip className="mr-2 h-4 w-4" />
                        Attach Files
                      </Button>
                      {attachments.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {attachments.length} file(s) selected
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setAttachments([])}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={handleSubmitResponse}
                      disabled={
                        (!response.trim() && attachments.length === 0) ||
                        isResponding ||
                        isResolving
                      }
                    >
                      {isResponding || isResolving ? (
                        <LoadingSpinner className="mr-2" />
                      ) : (
                        <Send className="mr-2 h-4 w-4" />
                      )}
                      {isResolved ? "Resolve Issue" : "Send Response"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Issue Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-sm text-muted-foreground">
                    {getStatusBadge(issue.status)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Type</p>
                  <p className="text-sm text-muted-foreground">
                    {getTypeBadge(issue.type)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Priority</p>
                  <p className="text-sm text-muted-foreground">
                    {getPriorityBadge(issue.priority)}
                  </p>
                </div>
                {issue.resolver && (
                  <div>
                    <p className="text-sm font-medium">Resolved By</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-6 w-6">
                        {issue.resolver.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={issue.resolver.avatar}
                            alt={issue.resolver.name}
                            className="object-cover"
                          />
                        ) : (
                          <AvatarFallback>
                            <MessageSquare className="h-3 w-3" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="text-sm">{issue.resolver.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(issue.resolvedAt!), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
