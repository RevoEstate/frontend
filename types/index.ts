import { customerSignupSchema } from "@/lib/validators";
import { z } from "zod";

export type CustomerSignupFormData = z.infer<typeof customerSignupSchema>;
