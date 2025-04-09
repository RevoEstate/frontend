"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function SignupSelectionPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<"company" | "client" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCompanySignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1500);
  };

  const handleClientSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/home");
    }, 1500);
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center relative flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/Images/home1.png')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* Welcome Message */}
      <div className="absolute top-10 text-center z-10 text-white px-4">
        <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">Welcome to RevoState</h1>
        <p className="mt-2 text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
          Where real estate companies and clients meet to explore, list, and manage properties effortlessly.
        </p>
      </div>

      {/* Card Section */}
      {!selectedType ? (
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-lg relative z-10 mt-28">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Sign Up as</CardTitle>
            <CardDescription>Choose how you want to use our platform</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center justify-center gap-3 hover:bg-white/90 transition-all"
              onClick={() => setSelectedType("company")}
            >
              <Building2 className="h-12 w-12" />
              <div className="text-xl font-semibold">A Real Estate Company</div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center justify-center gap-3 hover:bg-white/90 transition-all"
              onClick={() => setSelectedType("client")}
            >
              <User className="h-12 w-12" />
              <div className="text-xl font-semibold">A Client</div>
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm text-center">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      ) : selectedType === "company" ? (
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-lg relative z-10">
          <CardHeader>
            <Button
              variant="ghost"
              className="absolute left-2 top-2 p-2"
              onClick={() => setSelectedType(null)}
            >
              ← Back
            </Button>
            <CardTitle className="text-2xl font-bold text-center pt-4">
              Company Registration
            </CardTitle>
            <CardDescription className="text-center">
              Create your real estate company account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCompanySignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company name</Label>
                <Input id="company-name" placeholder="Acme Real Estate" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-email">Business email</Label>
                <Input id="company-email" type="email" placeholder="contact@acmerealestate.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-phone">Business phone</Label>
                <Input id="company-phone" type="tel" placeholder="+1 (555) 000-0000" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-license">License number</Label>
                <Input id="company-license" placeholder="RE12345678" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-password">Password</Label>
                <Input id="company-password" type="password" required />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="company-terms" required />
                <label
                  htmlFor="company-terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the terms and conditions
                </label>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create company account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-lg relative z-10">
          <CardHeader>
            <Button
              variant="ghost"
              className="absolute left-2 top-2 p-2"
              onClick={() => setSelectedType(null)}
            >
              ← Back
            </Button>
            <CardTitle className="text-2xl font-bold text-center pt-4">
              Client Registration
            </CardTitle>
            <CardDescription className="text-center">
              Create your client account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleClientSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client-first-name">First name</Label>
                  <Input id="client-first-name" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-last-name">Last name</Label>
                  <Input id="client-last-name" placeholder="Doe" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-email">Email</Label>
                <Input id="client-email" type="email" placeholder="john@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-phone">Phone number</Label>
                <Input id="client-phone" type="tel" placeholder="+1 (555) 000-0000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-password">Password</Label>
                <Input id="client-password" type="password" required />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="client-terms" required />
                <label
                  htmlFor="client-terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the terms and conditions
                </label>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create client account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
