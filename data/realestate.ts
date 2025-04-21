import { Realestate } from "@/types";

export const mockCompany: Realestate = {
  id: "comp_507f1f77bcf86cd799439011", // Matches min(3) requirement
  realEstateName: "Ovid Real Estate", // Matches min(3) requirement
  agentId: "agent_user123", // Matches min(1) requirement
  email: "contact@ovidrealestate.com",
  phone: "+1 (555) 123-4567", // 12 chars (>5)
  description: "Premium real estate services with over 15 years of experience in luxury properties across major cities.",
  logo: "https://example.com/logos/ovid-real-estate.jpg", // Valid URL

  address: {
    region: "California", // >2 chars
    city: "San Francisco", // >2 chars
    specificLocation: "123 Market St, Financial District", // >5 chars
    coordinates: {
      lat: 37.7749, // Valid range
      lng: -122.4194 // Valid range
    }
  },

  socialMedia: {
    instagram: "https://instagram.com/ovidrealestate", // Valid URL
    facebook: "https://facebook.com/ovidrealestate", // Valid URL
    linkedin: "https://linkedin.com/company/ovidrealestate", // Valid URL
    whatsapp: "+15551234567" // >5 chars
  },

  verificationDocuments: [
    "https://example.com/documents/license.pdf", // Valid URL
    "https://example.com/documents/tax-certificate.pdf", // Valid URL
    "https://example.com/documents/insurance.pdf" // Valid URL
  ],
  verificationStatus: "approved", // From enum
  isVerified: true,
  verifiedBy: "admin@revoestate.com",
  verifiedAt: new Date("2023-10-15T10:00:00Z")
} as unknown as Realestate; // Type assertion for MongoDB Document

// Unverified version (status "pending")
export const mockUnverifiedCompany: Realestate = {
  ...mockCompany,
  verificationDocuments: [
    "https://example.com/documents/tax-certificate.pdf" // At least one document
  ],
  verificationStatus: "pending", // Different status
  isVerified: false,
  verifiedBy: undefined,
  verifiedAt: undefined
} as unknown as Realestate;

// Rejected version
export const mockRejectedCompany: Realestate = {
  ...mockCompany,
  verificationStatus: "rejected", // All enum cases covered
  isVerified: false,
  verifiedBy: "admin@revoestate.com",
  verifiedAt: new Date("2023-10-16T14:30:00Z"),
  description: "Application rejected due to incomplete documents"
} as unknown as Realestate;

// Partial update example
export const mockCompanyUpdate = {
  phone: "+1 (555) 987-6543", // Valid update
  description: "Updated premium services description",
  address: {
    specificLocation: "456 New Street, Downtown" // >5 chars
  }
};

// Verification form data
export const mockVerificationData = {
  verificationDocuments: [
    "https://example.com/new/license.pdf",
    "https://example.com/new/insurance.pdf"
  ],
  termsAccepted: true // Required field
};