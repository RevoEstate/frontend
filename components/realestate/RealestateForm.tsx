"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { realestateSchema, realestateUpdateSchema } from "@/lib/validators";
import { Realestate } from "@/types";
import { useRouter } from "next/navigation";
import { realestateDefaultValues } from "@/lib/constants/index.ts";
import { toast } from "sonner";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapPinIcon } from "lucide-react";
import { LatLngTuple } from "leaflet";
import Image from "next/image";

// Mock data for regions and cities
const ETHIOPIA_REGIONS = [
  {
    name: "Addis Ababa",
    cities: [
      "Addis Ketema",
      "Akaky Kaliti",
      "Arada",
      "Bole",
      "Gullele",
      "Kirkos",
      "Kolfe Keranio",
      "Lideta",
      "Nifas Silk-Lafto",
      "Yeka",
      "Lemi Kura",
    ],
  },
  { name: "Afar", cities: ["Semera", "Asaita", "Awash"] },
  { name: "Amhara", cities: ["Bahir Dar", "Gondar", "Dessie"] },
  { name: "Benishangul-Gumuz", cities: ["Asosa", "Bambasi"] },
  { name: "Dire Dawa", cities: ["Dire Dawa"] },
  { name: "Gambela", cities: ["Gambela"] },
  { name: "Harari", cities: ["Harar"] },
  { name: "Oromia", cities: ["Adama", "Jimma", "Bishoftu"] },
  { name: "Sidama", cities: ["Hawassa", "Yirgalem"] },
  { name: "Somali", cities: ["Jijiga", "Degehabur"] },
  { name: "SNNPR", cities: ["Arba Minch", "Sodo", "Wolaita"] },
  { name: "Tigray", cities: ["Mekelle", "Axum", "Adigrat"] },
];

// Transform the data to match the existing format
const REGIONS = ETHIOPIA_REGIONS.map(region => ({
  value: region.name.toLowerCase().replace(/\s+/g, '_'),
  label: region.name
}));

const CITIES_BY_REGION = ETHIOPIA_REGIONS.reduce((acc, region) => {
  const regionKey = region.name.toLowerCase().replace(/\s+/g, '_');
  acc[regionKey] = region.cities.map(city => ({
    value: city.toLowerCase().replace(/\s+/g, '_'),
    label: city
  }));
  return acc;
}, {} as Record<string, { value: string; label: string }[]>);

export function RealestateForm({
  type,
  realestate,
  realestateId,
}: {
  type: "Create" | "Update";
  realestate?: Realestate;
  realestateId?: string;
}) {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  

  const form = useForm<z.infer<typeof realestateSchema>>({
    resolver:
      type === "Update"
        ? zodResolver(realestateUpdateSchema)
        : zodResolver(realestateSchema),
    defaultValues:
      realestate && type === "Update" ? realestate : realestateDefaultValues,
  });

  const onSubmit = async (values: z.infer<typeof realestateSchema>) => {
    console.log("onSubmit called with values:", values);

    try {
      const formData = new FormData();

      // Append all fields to FormData
      Object.entries(values).forEach(([key, value]) => {
        if (key === "address" || key === "socialMedia") {
          if (value !== undefined && value !== null) {
            formData.append(key, JSON.stringify(value));
          }
        } else if (key === "imageUrl") {
          if (value instanceof File) {
            formData.append("image", value);
          } else if (typeof value === "string" && value) {
            formData.append("imageUrl", value);
          }
        } else if (key === "documentUrl" && value instanceof File && type === "Create") {
          formData.append("document", value);
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      console.log("FormData entries:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const method = type === "Create" ? "POST" : "PATCH";
      const url =
        type === "Create"
          ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/companies/register`
          : `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/companies/update/${realestateId}`;
  
      const response = await fetch(url, {
        method,
        body: formData,
        credentials: "include",
      });

      console.log("API Response Status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Submission failed");
      }

      const data = await response.json();

      toast.success(
        `Real estate ${type === "Create" ? "created" : "updated"} successfully!`
      );
      form.reset()
      router.push("/realestate/profile");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Submission failed", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();
    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (!file.type.includes("image")) {
        toast.error("Please upload an image file");
        return;
      }

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        setPreview(imageDataUrl);
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  const selectedRegion = form.watch("address.region");

  const detectLocation = () => {
     setIsDetectingLocation(true);
     if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(
         (position) => {
           form.setValue("address.geoPoint.coordinates", [
             position.coords.longitude,
             position.coords.latitude,
           ]);
           setIsDetectingLocation(false);
           toast.success("Location detected successfully");
         },
         (error) => {
           toast.error("Error detecting location: " + error.message);
           setIsDetectingLocation(false);
         }
       );
     } else {
       toast.error("Geolocation is not supported by your browser");
       setIsDetectingLocation(false);
     }
   };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 my-5 bg-gray-50/40 p-10 rounded-2xl"
      >
        {/* Company Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="realEstateName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Realestate Name</FormLabel>
                <FormControl>
                  <Input placeholder="Ovid Real Estate" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Realestate Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="contact@company.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+251 91 234 5678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Realestate Logo</FormLabel>
                {preview || (typeof field.value === "string" && field.value) ? (
                  <div className="flex justify-center items-center border py-3">
                    <Image
                      src={preview || (typeof field.value === "string" ? field.value : "")}
                      alt="Realestate Logo"
                      width={128}
                      height={128} 
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Validate file type
                        if (!file.type.startsWith("image/")) {
                          form.setError("imageUrl", {
                            type: "manual",
                            message: "Please upload a valid image file",
                          });
                          return;
                        }
                        field.onChange(file);
                        const reader = new FileReader();
                        reader.onload = () => setPreview(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Address Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Address Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="address.region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region/State</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a region" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {REGIONS.map((region) => (
                        <SelectItem key={region.value} value={region.value}>
                          {region.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedRegion}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedRegion &&
                        CITIES_BY_REGION[
                          selectedRegion as keyof typeof CITIES_BY_REGION
                        ]?.map((city) => (
                          <SelectItem key={city.value} value={city.value}>
                            {city.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address.specificLocation"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Specific Location</FormLabel>
                  <FormControl>
                    <Input placeholder="kebele 11, 123 Main St" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your realestate..."
                  className="min-h-[120px] h-40"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Social Media */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Social Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(
              [
                { platform: "instagram", name: "socialMedia.instagram" },
                { platform: "facebook", name: "socialMedia.facebook" },
                { platform: "linkedin", name: "socialMedia.linkedin" },
                { platform: "tiktok", name: "socialMedia.tiktok" },
                { platform: "whatsapp", name: "socialMedia.whatsapp" },
              ] as const
            ).map(({ platform, name }) => (
              <FormField
                key={platform}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">{platform}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          platform === "whatsapp"
                            ? "+251 91 234 5678"
                            : `https://${platform}.com/yourusername`
                        }
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        
        
          <FormField
            control={form.control}
            name="documentUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Legal Document (PDF only)</FormLabel>
                {field.value && (
                  <div className="mt-2 text-sm text-gray-600">
                    Selected file: {field.value.name}
                  </div>
                )}
                <FormControl className="h-32">
                  <Input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      field.onChange(file);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
   
  

       
        {/* Coordinates Section */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <FormLabel>Coordinates</FormLabel>
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="address.geoPoint.coordinates.0"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Longitude"
                        {...field}
                        onChange={(e) =>
                          form.setValue(
                            "address.geoPoint.coordinates.0",
                            Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.geoPoint.coordinates.1"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Latitude"
                        {...field}
                        onChange={(e) =>
                          form.setValue(
                            "address.geoPoint.coordinates.1",
                            Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="outline"
                onClick={detectLocation}
                disabled={isDetectingLocation}
                className="cursor-pointer"
              >
                {isDetectingLocation ? "Detecting..." : "Auto Detect"}
              </Button>
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="bg-sky-600 hover:bg-sky-600/80 cursor-pointer w-full md:text-lg md:font-bold md:py-6"
        >
          {form.formState.isSubmitting
            ? "Submitting"
            : `${type} Realestate Account`}
        </Button>
      </form>
    </Form>
  );
}
