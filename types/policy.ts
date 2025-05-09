export interface Policy {
  _id: string;
  title: string;
  description: string;
  effectiveDate: string;
  status: "active" | "inactive" | "archived";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePolicyDTO {
  title: string;
  description: string;
  effectiveDate: string;
}

export interface UpdatePolicyDTO {
  title?: string;
  description?: string;
  effectiveDate?: string;
  status?: "active" | "inactive" | "archived";
}

export interface PolicyFilters {
  status?: "active" | "inactive" | "archived";
  search?: string;
  page?: number;
  limit?: number;
} 
