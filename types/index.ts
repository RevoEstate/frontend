import { customerSignupSchema, realEstateSignupSchema } from "@/lib/validators";
import { z } from "zod";

export type CustomerSignupFormData = z.infer<typeof customerSignupSchema>;
export type RealEstateSignupFormData = z.infer<typeof realEstateSignupSchema>;