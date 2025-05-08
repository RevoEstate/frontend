import { User } from "./user";

export type IssueStatus = "open" | "in-progress" | "resolved" | "closed";
export type IssueType = "technical" | "billing" | "account" | "property" | "other";
export type IssuePriority = "low" | "medium" | "high" | "critical";
export type SenderType = "user" | "admin" | "support";

export interface Attachment {
  name: string;
  url: string;
  size: string;
}

export interface ConversationMessage {
  id: string;
  sender: string;
  senderType: SenderType;
  message: string;
  timestamp: Date;
  attachments: Attachment[];
}

export interface RaisedBy {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  type: "user" | "agent" | "admin";
}

export interface Issue {
  _id: string;
  issueId: string;
  raisedBy: RaisedBy;
  summary: string;
  description: string;
  dateRaised: Date;
  status: IssueStatus;
  type: IssueType;
  priority: IssuePriority;
  attachments: Attachment[];
  conversation: ConversationMessage[];
  resolvedBy?: string;
  resolvedAt?: Date;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
  resolver?: User;
}

export interface IssueFilters {
  page?: number;
  limit?: number;
  status?: IssueStatus;
  type?: IssueType;
  priority?: IssuePriority;
  search?: string;
  sortBy?: keyof Issue;
  sortOrder?: "asc" | "desc";
}

export interface CreateIssueDTO {
  summary: string;
  description: string;
  type: IssueType;
  priority: IssuePriority;
  attachments?: File[];
}

export interface RespondToIssueDTO {
  message: string;
  attachments?: File[];
}

export interface ResolveIssueDTO {
  resolutionMessage: string;
}

export interface IssuesResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    issues: Issue[];
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
}

export interface IssueResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Issue;
} 
