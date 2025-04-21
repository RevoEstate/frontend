import { z } from "zod";

// Realestate Information Schema
const realestateSchema = z.object({
  realEstateName: z.string().min(3, "Company name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be 10 digits"),
  description: z.string().optional(),
  imageUrl: z.instanceof(File).optional(),

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
  documentUrl: z.instanceof(File).refine(
    file => file?.type === 'application/pdf', 
    { message: "Only PDF files are accepted" }
  ).optional()
  
 // verificationStatus: z.enum(["pending", "approved", "rejected"]),
  // isVerified: z.boolean(),
  // verifiedBy: z.string().optional(),
  // verifiedAt: z.date().optional(),
});




// a partial schema for updates (all fields optional)
const realestateUpdateSchema = realestateSchema.partial();

// Verification form schema (fields needed for verification)
const VerificationFormSchema = realestateSchema.pick({
  documentUrl: true,
}).extend({
  termsAccepted: z.boolean().refine(val => val, {
    message: "You must accept the terms and conditions",
  }),
});

// Export everything
export {
  realestateSchema,
  realestateUpdateSchema,
  VerificationFormSchema,
};
