import { customerSignupSchema } from "@/app/(auth)/signup-customer/customer-signup-form";
import { z } from "zod";

export type CustomerSignupFormData = z.infer<typeof customerSignupSchema>;
