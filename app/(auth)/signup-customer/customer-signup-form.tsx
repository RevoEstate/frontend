"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

// Define the schema for signup with firstName and lastName
const customerSignupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    passwordConfirm: z.string().min(8, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

export function CustomerSignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof customerSignupSchema>>({
    resolver: zodResolver(customerSignupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const resetState = () => {
    setError(null);
    setSuccess(null);
  };

  const onSubmit = async (values: z.infer<typeof customerSignupSchema>) => {
    try {
      interface SignupValues {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        callbackURL: string;
      }

      interface AuthClientCallbacks {
        onResponse: () => void;
        onRequest: () => void;
        onSuccess: () => void;
        onError: (ctx: { error: { message: string } }) => void;
      }

      await authClient.signUp.email(
        {
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
          callbackURL: "http://localhost:5173/sign-in",
        } as SignupValues,
        {
          onResponse: () => {
            setLoading(false);
          },
          onRequest: () => {
            resetState();
            setLoading(true);
          },
          onSuccess: () => {
            
            setSuccess("Verification link has been sent to your email");
            toast.success("Verification link sent!", {
              description: `A verification email has been sent to ${values.email}. Please check your inbox and verify your email to continue.`,
              duration: 5000,
            });
          },
          onError: (ctx: { error: { message: string } }) => {
            setError(ctx.error.message);
            toast.error("Signup failed", {
              description: ctx.error.message || "Something went wrong",
            });
            form.setError("root", {
              message: ctx.error.message || "Something went wrong",
            });
          },
        } as AuthClientCallbacks
      );
    } catch (error) {
      setError("An unexpected error occurred");
      form.setError("root", { message: "An unexpected error occurred" });
      toast.error("Signup failed", {
        description: "An unexpected error occurred",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center sovere p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >
        {/* Beautiful Real Estate Image */}
        <div className="hidden md:block relative">
          <Image
            src="/images/signup-image.jpg"
            alt="Luxury Home"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-black/5 flex items-end p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-white"
            >
              <h2 className="text-3xl font-bold mb-2">Find Your Dream Home</h2>
              <p className="text-sky-100">
                Join thousands of happy homeowners today
              </p>
            </motion.div>
          </div>
        </div>

        {/* Animated Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="p-8 md:p-12 flex flex-col justify-center"
        >
          <div className="mb-8 text-center md:text-left">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold text-sky-600 mb-2"
            >
              Create Your Account
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-muted-foreground text-sm"
            >
              Join RevoEstate and discover your perfect home
            </motion.p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {(form.formState.errors.root || error || success) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Alert variant={success ? "default" : "destructive"}>
                    <AlertDescription>
                      {success || error || form.formState.errors.root?.message}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sky-800">First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John"
                          {...field}
                          className="border-sky-200 focus:border-sky-500 focus:ring-sky-500"
                        />
                      </FormControl>
                      <FormMessage className="text-rose-500" />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sky-800">Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Doe"
                          {...field}
                          className="border-sky-200 focus:border-sky-500 focus:ring-sky-500"
                        />
                      </FormControl>
                      <FormMessage className="text-rose-500" />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sky-800">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john@example.com"
                          {...field}
                          className="border-sky-200 focus:border-sky-500 focus:ring-sky-500"
                        />
                      </FormControl>
                      <FormMessage className="text-rose-500" />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sky-800">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          className="border-sky-200 focus:border-sky-500 focus:ring-sky-500"
                        />
                      </FormControl>
                      <FormMessage className="text-rose-500" />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 }}
              >
                <FormField
                  control={form.control}
                  name="passwordConfirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sky-800">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          className="border-sky-200 focus:border-sky-500 focus:ring-sky-500"
                        />
                      </FormControl>
                      <FormMessage className="text-rose-500" />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-lg transition-all duration-300 transform hover:scale-[1.01] cursor-pointer"
                  disabled={form.formState.isSubmitting || loading}
                >
                  {form.formState.isSubmitting || loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Sign Up Now"
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-3 text-center"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.3, type: "spring", stiffness: 300 }}
            >
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-gray-500 hover:text-sky-500 transition-colors flex items-center justify-end gap-1"
              >
                <span>Forgot password?</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
            <div className="mt-5">
              <p className="text-gray-500">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="font-medium text-sky-600 hover:text-sky-500 underline underline-offset-4 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
