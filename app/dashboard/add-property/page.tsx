"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus } from "lucide-react";

export default function AddPropertyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1500);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <DashboardLayout>
      <div className="container max-w-4xl mx-auto py-6">
        <h1 className="text-3xl font-bold mb-8">Add Property</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Property Title</Label>
            <Input id="title" placeholder="Property Title" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="Location" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" placeholder="Price" type="number" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Size</Label>
              <Input
                id="size"
                placeholder="Size (sq ft)"
                type="number"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                placeholder="Bedrooms"
                type="number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                placeholder="Bathrooms"
                type="number"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Property Description</Label>
            <Textarea
              id="description"
              placeholder="Property Description"
              rows={5}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Property Image</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
              {imagePreview ? (
                <div className="relative w-full h-64">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Property preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setImagePreview(null)}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <>
                  <ImagePlus className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Upload Image</p>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("image")?.click()}
                  >
                    Select File
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Button
              type="submit"
              className="w-full max-w-md bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit Property"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
