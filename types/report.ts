import { Property } from "./property";
import { User } from "./user";

export type ReportReason =
  | "Violent content"
  | "Sexually explicit content"
  | "Fraudulent listing"
  | "Hate speech or discrimination"
  | "Spam or misleading information"
  | "Inaccurate property details";

export type ReportStatus = "open" | "resolved" | "dismissed";

export interface Report {
  _id: string;
  reportId: string;
  propertyId: string;
  reportedBy: string;
  reason: ReportReason;
  status: ReportStatus;
  notes?: string;
  resolvedBy?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Populated fields
  property?: Property;
  reporter?: {
    name: string;
    email: string;
  };
  resolver?: {
    name: string;
    email: string;
  };
}

export interface CreateReportDto {
  propertyId: string;
  reason: ReportReason;
  notes?: string;
}

export interface UpdateReportDto {
  status?: ReportStatus;
  notes?: string;
}

export interface ReportFilters {
  status?: ReportStatus;
  reason?: ReportReason;
  startDate?: Date;
  endDate?: Date;
  search?: string;
} 
