import { customerSignupSchema } from "@/app/(auth)/signup-customer/customer-signup-form";
import { realestateSchema } from "@/lib/validators";
import { z } from "zod";

export type CustomerSignupFormData = z.infer<typeof customerSignupSchema>;

export type Realestate = z.infer<typeof realestateSchema>
