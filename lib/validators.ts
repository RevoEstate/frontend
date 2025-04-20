import { z } from "zod";

// Realestate Information Schema

const CompanySchema = z.object({
  id: z.string().min(3, "Id required"),
  realEstateName: z.string().min(3, "Company name must be at least 3 characters"),
  agentId: z.string().min(1, "User ID is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number must be at least 5 characters"),
  description: z.string().optional(),
  logo: z.string().url("Invalid URL format").optional(),

  // Address Information
  address: z.object({
    region: z.string().min(2, "Region must be at least 2 characters"),
    city: z.string().min(2, "City must be at least 2 characters"),
    specificLocation: z.string().min(5, "Specific location must be at least 5 characters"),
    coordinates: z.object({
      lat: z.number().min(-90).max(90).optional(),
      lng: z.number().min(-180).max(180).optional(),
    }).optional(),
  }),

  // Social Media
  socialMedia: z.object({
    instagram: z.string().url("Invalid URL").optional(),
    facebook: z.string().url("Invalid URL").optional(),
    linkedin: z.string().url("Invalid URL").optional(),
    tiktok: z.string().url("Invalid URL").optional(),
    whatsapp: z.string().min(5, "WhatsApp must be at least 5 characters").optional(),
  }).optional(),

  // Verification and Licensing
  verificationDocuments: z.array(z.string().url("Invalid document URL")),
  verificationStatus: z.enum(["pending", "approved", "rejected"]),
  isVerified: z.boolean(),
  verifiedBy: z.string().optional(),
  verifiedAt: z.date().optional(),
});

// Infer the TypeScript type from Zod schema
type ICompany = z.infer<typeof CompanySchema> & Document;

// For forms that don't need MongoDB Document extension
type ICompanyForm = z.infer<typeof CompanySchema>;

// Create a partial schema for updates (all fields optional)
const CompanyUpdateSchema = CompanySchema.partial();

// Verification form schema (fields needed for verification)
const VerificationFormSchema = CompanySchema.pick({
  verificationDocuments: true,
}).extend({
  termsAccepted: z.boolean().refine(val => val, {
    message: "You must accept the terms and conditions",
  }),
});

// Export everything
export {
  CompanySchema,
  CompanyUpdateSchema,
  VerificationFormSchema,
  type ICompany,
  type ICompanyForm,
};
