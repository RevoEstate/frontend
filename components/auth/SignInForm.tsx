"use client";

import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Loader2, GithubIcon } from "lucide-react";
import { z } from "zod";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { FaGoogle } from "react-icons/fa";
import AuthGuard from "./AuthGuard";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingGoogle, setPendingGoogle] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // useEffect(() => {
  //   const checkSession = async () => {
  //     try {
  //       const session = await authClient.getSession();
  //       console.log("Login Session: ", session);

  //       if (session) {
  //         const userRole = session?.data?.user?.role;
  //         if (userRole === "systemAdmin") {
  //           router.replace("/systemAdmin");
  //         } else if (userRole === "support") {
  //           router.replace("/systemManager");
  //         } else if (userRole === "agent") {
  //           router.replace("/realestate");
  //         } else {
  //           router.replace("/");
  //         }
  //       }
  //     } catch (err) {
  //       setError("Session check failed:");
  //     }
  //   };
  //   checkSession();
  // }, [router]);

  const resetState = () => {
    setError(null);
    setSuccess(null);
  };

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      setSuccess("Email verified successfully! Please sign in.");
      toast.success("Email verified successfully!", {
        description: "Please sign in to continue.",
        duration: 5000,
      });
    }
    if (searchParams.get("error") === "verification_failed") {
      setError("Verification link is invalid or expired.");
      toast.error("Verification failed", {
        description: "The verification link is invalid or expired.",
        duration: 5000,
      });
    }
  }, [searchParams]);

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    try {
      await authClient.signIn.email(
        {
          email: values.email,
          password: values.password,
        },
        {
          onResponse: () => {
            setLoading(false);
          },
          onRequest: () => {
            resetState();
            setLoading(true);
          },
          onSuccess: async () => {
            setSuccess("Logged in successfully");
            toast.success("Logged in successfully!", {
              description: "Welcome back to RevoEstate!",
              duration: 2000,
            });
            try {
              const session = await authClient.getSession();
              const userRole = session?.data?.user?.role;
              const userId = session?.data?.user?.id

              if (userRole === "systemAdmin") {
                // router.replace("/systemAdmin");
                router.replace(`/systemAdmin/${userId}`);
              } else if (userRole === "support") {
                // router.replace("/systemManager");
                router.replace(`/systemManager/${userId}`);
              } else if (userRole === "agent") {
                router.replace(`/realestate`);
              } else {
                router.replace("/");
              }
            } catch (err) {
              console.error("Failed to fetch session:", err);
              router.replace("/"); // Fallback redirect
            }
          },
          onError: (ctx) => {
            if (ctx.error.status === 403) {
              setError("Please verify your email address");
              toast.error("Email not verified", {
                description: "Please verify your email address to sign in.",
                duration: 5000,
              });
            } else {
              setError(ctx.error.message);
              toast.error("Sign-in failed", {
                description: ctx.error.message || "Something went wrong",
                duration: 5000,
              });
            }
            form.setError("root", {
              message: ctx.error.message || "Something went wrong",
            });
          },
        }
      );
    } catch (error) {
      setError("Something went wrong");
      toast.error("Sign-in failed", {
        description: "An unexpected error occurred",
        duration: 5000,
      });
      form.setError("root", { message: "Something went wrong" });
    }
  };

  const handleSignInWithGoogle = async () => {
    setPendingGoogle(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/properties`,
      });
    } catch (error) {
      setError("Failed to sign in with Google");
      toast.error("Google sign-in failed", {
        description: "An unexpected error occurred",
        duration: 5000,
      });
    } finally {
      setPendingGoogle(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
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
              <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
              <p className="text-sky-100">Sign in to find your dream home</p>
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
              Sign In
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-muted-foreground text-sm"
            >
              Access your RevoEstate account
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sky-800">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john@example.com"
                          {...field}
                          className="border-sky-200 focus:border-sky-500 focus:ring-sky-500"
                          autoComplete="email"
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sky-800">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          className="border-sky-200 focus:border-sky-500 focus:ring-sky-500"
                          autoComplete="current-password"
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
                transition={{ delay: 0.8 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-lg transition-all duration-300 transform hover:scale-[1.01] cursor-pointer"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Button
                  variant="outline"
                  className="w-full border-sky-200 hover:bg-sky-50"
                  onClick={handleSignInWithGoogle}
                  disabled={pendingGoogle}
                >
                  {pendingGoogle ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <FaGoogle />
                      Continue with Google
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="mt-3 text-center"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.1, type: "spring", stiffness: 300 }}
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
                Don’t have an account?{" "}
                <Link
                  href="/signup-customer"
                  className="font-medium text-sky-600 hover:text-sky-500 underline underline-offset-4 transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
