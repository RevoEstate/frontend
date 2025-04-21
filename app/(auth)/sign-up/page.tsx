"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/shared/loading-button";
import Link from "next/link";
import { signUpSchema } from "@/lib/zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export default function SignUp() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    setError(null); // Clear previous error
    await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.name,
      },
      {
        onRequest: () => {
          setPending(true);
        },
        onSuccess: (ctx) => {
          toast({
            title: "Success",
            description: ctx.data.message || "Account created successfully",
          });
          router.push("/sign-in");
          router.refresh();
        },
        onError: (ctx) => {
          console.error("Sign-up error:", ctx);
          const errorMessage = ctx.error?.message || "Something went wrong";
          const message = errorMessage.includes("Email already exists")
            ? "This email is already registered. Try signing in."
            : errorMessage;
          setError(message);
          toast({
            title: "Sign-up failed",
            description: message,
            variant: "destructive",
          });
        },
      }
    );
    setPending(false);
  };

  return (
    <div className="grow flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800">
            Create Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {["name", "email", "password", "confirmPassword"].map((field) => (
                <FormField
                  control={form.control}
                  key={field}
                  name={field as keyof z.infer<typeof signUpSchema>}
                  render={({ field: fieldProps }) => (
                    <FormItem>
                      <FormLabel>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type={
                            field.includes("password")
                              ? "password"
                              : field === "email"
                                ? "email"
                                : "text"
                          }
                          placeholder={`Enter your ${field}`}
                          {...fieldProps}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              {error && (
                <div className="flex items-center justify-between bg-red-100 text-red-700 p-3 rounded-md">
                  <span>{error}</span>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-700 hover:text-red-900"
                    aria-label="Clear error"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
              <LoadingButton pending={pending}>Sign up</LoadingButton>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            <Link href="/sign-in" className="text-primary hover:underline">
              Already have an account? Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
