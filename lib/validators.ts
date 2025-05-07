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
    region: z.string().min(1, "Region is required"),
    city: z.string().min(1, "City is required"),
    specificLocation: z.string().optional(),
    geoPoint: z.object({
      type: z.literal("Point"),
      coordinates: z
        .array(z.number())
        .length(2, "Coordinates must contain exactly 2 numbers [longitude, latitude]"),
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

// Property Creating Schema
export const createPropertySchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(3, "Description is required"),
  price: z.number().positive("Price must be a positive number"),
  area: z.number().positive("Area must be a positive number"),
  address: z.object({
    region: z.string().min(1, "Region is required"),
    city: z.string().min(1, "City is required"),
    specificLocation: z.string().optional(),
    geoPoint: z.object({
      type: z.literal("Point"),
      coordinates: z
        .array(z.number())
        .length(2, "Coordinates must contain exactly 2 numbers [longitude, latitude]"),
    }),
  }),
  propertyType: z.enum(["Apartment", "House", "Commercial", "Land", "Villa"], {
    errorMap: () => ({ message: "Invalid property type" }),
  }),
  status: z.enum(["available", "sold", "rented"]).default("available"),
  images: z
    .instanceof(File, { message: "Please upload at least one image" })
    .array()
    .nonempty("At least one image is required")
    .refine(
      (files) => files.every((file) => file.size <= 5 * 1024 * 1024),
      "Each file must be less than 5MB"
    )
    .refine(
      (files) =>
        files.every((file) =>
          ["image/jpeg", "image/png", "image/webp"].includes(file.type)
        ),
      "Only .jpg, .png, and .webp formats are supported"
    ),
  bedrooms: z.number().int().nonnegative("Bedrooms must be a non-negative integer"),
  bathrooms: z.number().int().nonnegative("Bathrooms must be a non-negative integer"),
  builtInYear: z.number().min(2000, "Built year must be above 2000 G.C").max(new Date().getFullYear(), "Built year must be below 2025 G.C").optional(),
  landArea: z.number().positive("Land area must be a positive number"),
  panoramicImages: z
    .instanceof(File, { message: "Please upload valid images" })
    .array()
    .optional()
    .refine(
      (files) => !files || files.every((file) => file.size <= 5 * 1024 * 1024),
      "Each file must be less than 5MB"
    )
    .refine(
      (files) =>
        !files ||
        files.every((file) =>
          ["image/jpeg", "image/png", "image/webp"].includes(file.type)
        ),
      "Only .jpg, .png, and .webp formats are supported"
    ),
  listingType: z.enum(["For Rent", "For Sale"], {
    errorMap: () => ({ message: "Invalid listing type" }),
  }),
  furnished: z.enum(["Yes", "No"]).default("No"),
  amenities: z.array(z.string()).default([]),
});


// Property Updating Schema
export const updatePropertySchema = z.object({
  title: z.string().min(3, "Title is required").optional(),
  description: z.string().min(3, "Description is required").optional(),
  price: z.number().positive("Price must be a positive number").optional(),
  area: z.number().positive("Area must be a positive number").optional(),
  address: z.object({
    region: z.string().min(1, "Region is required").optional(),
    city: z.string().min(1, "City is required").optional(),
    specificLocation: z.string().optional(),
    geoPoint: z.object({
      type: z.literal("Point"),
      coordinates: z
        .array(z.number())
        .length(2, "Coordinates must contain exactly 2 numbers [longitude, latitude]"),
    }).optional(),
  }).optional(),
  propertyType: z.enum(["Apartment", "House", "Commercial", "Land", "Villa"], {
    errorMap: () => ({ message: "Invalid property type" }),
  }).optional(),
  status: z.enum(["available", "sold", "rented"]).default("available").optional(),
  images: z
    .instanceof(File, { message: "Please upload at least one image" })
    .array()
    .nonempty("At least one image is required")
    .refine(
      (files) => files.every((file) => file.size <= 5 * 1024 * 1024),
      "Each file must be less than 5MB"
    )
    .refine(
      (files) =>
        files.every((file) =>
          ["image/jpeg", "image/png", "image/webp"].includes(file.type)
        ),
      "Only .jpg, .png, and .webp formats are supported"
    )
    .optional(),
  bedrooms: z.number().int().nonnegative("Bedrooms must be a non-negative integer").optional(),
  bathrooms: z.number().int().nonnegative("Bathrooms must be a non-negative integer").optional(),
  builtInYear: z.number()
    .min(2000, "Built year must be above 2000 G.C")
    .max(new Date().getFullYear(), "Built year must be below 2025 G.C")
    .optional(),
  landArea: z.number().positive("Land area must be a positive number").optional(),
  panoramicImages: z
    .instanceof(File, { message: "Please upload valid images" })
    .array()
    .optional()
    .refine(
      (files) => !files || files.every((file) => file.size <= 5 * 1024 * 1024),
      "Each file must be less than 5MB"
    )
    .refine(
      (files) =>
        !files ||
        files.every((file) =>
          ["image/jpeg", "image/png", "image/webp"].includes(file.type)
        ),
      "Only .jpg, .png, and .webp formats are supported"
    ),
  listingType: z.enum(["For Rent", "For Sale"], {
    errorMap: () => ({ message: "Invalid listing type" }),
  }).optional(),
  furnished: z.enum(["Yes", "No"]).default("No").optional(),
  amenities: z.array(z.string()).default([]).optional(),
});