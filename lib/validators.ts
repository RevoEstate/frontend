import { z } from "zod";

// Realestate Information Schema
const realestateSchema = z.object({
  realEstateName: z
    .string()
    .min(3, "Company name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
  .string()
  .refine(
    (value) => /^(?:\+2519\d{8}|09\d{8})$/.test(value),
    { message: "Use Ethiopian mobile number format: 0911234567 or +251911234567" }
  ),
  description: z.string().optional(),
  imageUrl: z.instanceof(File).optional(),

  // Address Information
  address: z.object({
    region: z.string().min(2, "Region must be at least 2 characters"),
    city: z.string().min(2, "City must be at least 2 characters"),
    specificLocation: z
      .string()
      .min(5, "Specific location must be at least 5 characters"),
      coordinates: z.object({
        lat: z.number()
          .min(-90)
          .max(90)
          .transform((val) => parseFloat(val.toFixed(5))), // Rounds to 5 decimal places
        lng: z.number()
          .min(-180)
          .max(180)
          .transform((val) => parseFloat(val.toFixed(5))), // Rounds to 5 decimal places
      }),
  }),

  // Social Media
  socialMedia: z
    .object({
      instagram: z.string().url("Invalid URL").optional(),
      facebook: z.string().url("Invalid URL").optional(),
      linkedin: z.string().url("Invalid URL").optional(),
      tiktok: z.string().url("Invalid URL").optional(),
      whatsapp: z
        .string()
        .min(10, "WhatsApp must be 10 digits")
        .optional(),
    })
    .optional()
    .default({}),

  // Verification and Licensing
  documentUrl: z
    .instanceof(File)
    .refine((file) => file?.type === "application/pdf", {
      message: "Only PDF files are accepted",
    })
});

// a partial schema for updates (all fields optional)
const realestateUpdateSchema = realestateSchema.partial();



// Export everything
export { realestateSchema, realestateUpdateSchema };
