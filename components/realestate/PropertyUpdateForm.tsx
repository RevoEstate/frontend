"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { createPropertySchema, updatePropertySchema } from "@/lib/validators";
import { createPropertyDefaultValues } from "@/lib/constants/index.ts";
import { toast } from "sonner";
import Image from "next/image";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";
import { ETHIOPIA_REGIONS } from "./PropertyForm";

const PropertyUpdateForm = ({
  onSuccess,
  property,
}: {
  property?: any;
  onSuccess?: () => void;
}) => {
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>(
    property?.images || []
  );
  const [existingPanoramicImages, setExistinPanoramicgImages] = useState<
    string[]
  >(property?.panoramicImages || []);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [panoramicPreviews, setPanoramicPreviews] = useState<string[]>([]);
  const [amenityInput, setAmenityInput] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [deletingImages, setDeletingImages] = useState<string[]>([]);
  const [deletingPanoramicImages, setDeletingPanoramicImages] = useState<string[]>([]);



  const router = useRouter();

  const form = useForm<z.infer<typeof updatePropertySchema>>({
    resolver: zodResolver(updatePropertySchema),
    defaultValues: property
      ? {
          ...property,
          images: undefined,
          panoramicImages: undefined,
        }
      : undefined,
  });

  const selectedRegion = form.watch("address.region");
  // Filter cities based on selected region
  const citiesForRegion =
    ETHIOPIA_REGIONS.find((region) => region.name === selectedRegion)?.cities ||
    [];

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

  // const properties = property
  // console.log("Update form", properties)

  async function onSubmit(values: z.infer<typeof updatePropertySchema>) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === "address") {
        if (value) formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null && key !== "amenities") {
        formData.append(key, value.toString());
      }
    });

    if (values.amenities && Array.isArray(values.amenities)) {
      values.amenities.forEach((amenity) => {
        formData.append("amenities", amenity);
      });
    }

    if (values.images && Array.isArray(values.images)) {
      values.images.forEach((file) => {
        formData.append(`images`, file);
      });
    }
    if (values.panoramicImages && Array.isArray(values.panoramicImages)) {
      values.panoramicImages.forEach((file) => {
        formData.append(`panoramicImages`, file);
      });
    }

    console.log(values);
    console.log("FormData entries:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    console.log(values);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/properties/updateproperty/${property._id}`,
        {
          method: "PATCH",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit form");
      }

      const data = await response.json();
      toast.success("Property updated successfully!");
      // Update local state with new images from response
      if (data.images) {
        setExistingImages(data.images);
      }
      if (data.panoramicImages) {
        setExistinPanoramicgImages(data.panoramicImages);
      }
      setImagePreviews([]);
      setPanoramicPreviews([]);
      setAmenities([]);
      setAmenityInput("");
      // Call onSuccess callback if it exists
      if (onSuccess) {
        onSuccess(); // This will trigger the refetch in parent component
      }
      router.push("/realestate/properties");
    } catch (error) {
      toast.error("Error submitting form: " + (error as Error).message);
    }
  }

  const handleImageDelete = async (imageurl: string) => {
    try {
      setDeletingImages(prev => [...prev, imageurl]); // Track deleting image
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/properties/${property._id}/image`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageurl }),
          credentials: "include",
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete image");
      }
  
      const data = await response.json();
      toast.success("Image Deleted Successfully");
      
      // Update local state
      setExistingImages(prev => prev.filter(img => img !== imageurl));
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("Error deleting image: " + (error as Error).message);
    } finally {
      setDeletingImages(prev => prev.filter(url => url !== imageurl)); // Clear deleting state
    }
  };

  const handlePanaromicImageDelete = async (imageurl: string) => {
    try {
      setDeletingPanoramicImages(prev => [...prev, imageurl]);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/properties/${property._id}/panaromicimage`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageurl }),
          credentials: "include",
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete image");
      }
  
      const data = await response.json();
      toast.success("Panoramic Image Deleted Successfully");
      
      // Update local state
      setExistinPanoramicgImages(prev => prev.filter(img => img !== imageurl));
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("Error deleting panoramic image: " + (error as Error).message);
    } finally {
      setDeletingPanoramicImages(prev => prev.filter(url => url !== imageurl));
    }
  };

  // Clean up preview URLs
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
      panoramicPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews, panoramicPreviews]);

  // Sync with form values
  useEffect(() => {
    const formAmenities = form.getValues("amenities");
    if (formAmenities) {
      setAmenities(formAmenities);
    }
  }, [form]);

  const handleAmenityKeyDown = (e: React.KeyboardEvent) => {
    if (["Enter", "Tab", ","].includes(e.key) && amenityInput.trim()) {
      e.preventDefault();
      addAmenity();
    }
  };

  const addAmenity = () => {
    if (amenityInput.trim() && !amenities.includes(amenityInput.trim())) {
      const newAmenities = [...amenities, amenityInput.trim()];
      setAmenities(newAmenities);
      form.setValue("amenities", newAmenities); // This updates the form values
      setAmenityInput("");
      if (onSuccess) {
        onSuccess(); // This will trigger the refetch in parent component
      }
    }
  };

  const removeAmenity = (index: number) => {
    const newAmenities = amenities.filter((_, i) => i !== index);
    setAmenities(newAmenities);
    form.setValue("amenities", newAmenities); // This updates the form values
    if (onSuccess) {
      onSuccess(); // This will trigger the refetch in parent component
    }
  };

  // Remove preview and file
  const removePreview = useCallback(
    (index: number, type: "regular" | "panoramic") => {
      if (type === "regular") {
        const newPreviews = [...imagePreviews];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setImagePreviews(newPreviews);

        const newFiles =
          form.getValues("images")?.filter((_, i) => i !== index) || [];
        form.setValue("images", newFiles as [File, ...File[]]);
      } else {
        const newPreviews = [...panoramicPreviews];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setPanoramicPreviews(newPreviews);

        const newFiles =
          form.getValues("panoramicImages")?.filter((_, i) => i !== index) ||
          [];
        form.setValue("panoramicImages", newFiles as [File, ...File[]]);
      }
    },
    [imagePreviews, panoramicPreviews, form]
  );

  // Handle adding regular files
  const handleAddFiles = useCallback(
    (newFiles: File[]) => {
      const validFiles = newFiles.filter((file) =>
        ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
          file.type
        )
      );
      const currentFiles = form.getValues("images") || [];
      const updatedFiles = [...currentFiles, ...validFiles];
      form.setValue("images", updatedFiles as [File, ...File[]]);

      // Update previews
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
      const newPreviews = updatedFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews(newPreviews);
    },
    [form, imagePreviews]
  );

  // Handle adding panoramic files
  const handleAddPanoramicFiles = useCallback(
    (newFiles: File[]) => {
      const validFiles = newFiles.filter((file) =>
        ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
          file.type
        )
      );
      const currentFiles = form.getValues("panoramicImages") || [];
      const updatedFiles = [...currentFiles, ...validFiles];
      form.setValue("panoramicImages", updatedFiles as [File, ...File[]]);

      // Update previews
      panoramicPreviews.forEach((preview) => URL.revokeObjectURL(preview));
      const newPreviews = updatedFiles.map((file) => URL.createObjectURL(file));
      setPanoramicPreviews(newPreviews);
    },
    [form, panoramicPreviews]
  );

  // Drag-and-drop configuration for regular images
  const onDropRegular = useCallback(
    (acceptedFiles: File[]) => {
      handleAddFiles(acceptedFiles);
    },
    [handleAddFiles]
  );

  const {
    getRootProps: getRegularRootProps,
    getInputProps: getRegularInputProps,
    isDragActive: isRegularDragActive,
  } = useDropzone({
    onDrop: onDropRegular,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
    },
    maxFiles: 20,
  });

  // Drag-and-drop configuration for panoramic images
  const onDropPanoramic = useCallback(
    (acceptedFiles: File[]) => {
      handleAddPanoramicFiles(acceptedFiles);
    },
    [handleAddPanoramicFiles]
  );

  const {
    getRootProps: getPanoramicRootProps,
    getInputProps: getPanoramicInputProps,
    isDragActive: isPanoramicDragActive,
  } = useDropzone({
    onDrop: onDropPanoramic,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
    },
    maxFiles: 10,
  });

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-[70vw]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-baseline">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Modern Apartment in Bole" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className=""
                      placeholder="Describe your property in detail..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-baseline">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="5000000"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Floor Area (sqm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="120"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    The total area of all floors within the house, measured from
                    the inside walls
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="landArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plot Area (sqm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="200"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    The total area of the land on which the house is constructed
                    including the compound
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bedrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bedrooms</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="3"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bathrooms</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="2"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="builtInYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Built Year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="2010"
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value === "" ? undefined : Number(value)
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Property Type and Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="propertyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem className="cursor-pointer" value="Apartment">
                        Apartment
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="House">
                        House
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="Commercial">
                        Commercial
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="Land">
                        Land
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="Villa">
                        Villa
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="listingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Listing Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Select listing type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem className="cursor-pointer" value="For Sale">
                        For Sale
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="For Rent">
                        For Rent
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled
                  >
                    <FormControl>
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem className="cursor-pointer" value="available">
                        Available
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="sold">
                        Sold
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="rented">
                        Rented
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Address Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="address.region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="cursor-pointer">
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ETHIOPIA_REGIONS.map((region) => (
                          <SelectItem
                            className="cursor-pointer"
                            key={region.name}
                            value={region.name}
                          >
                            {region.name}
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
                      <FormControl>
                        <SelectTrigger className="cursor-pointer">
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {citiesForRegion.map((city) => (
                          <SelectItem
                            className="cursor-pointer"
                            key={city}
                            value={city}
                          >
                            {city}
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
                  <FormItem>
                    <FormLabel>Specific Location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Bole, near Friendship Center"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Geo Coordinates */}
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
          </div>

          {/* Images Section */}
          <div>
            {existingImages.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Current Images</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {existingImages.map((imageUrl, index) => {
                    const isDeleting = deletingImages.includes(imageUrl); // Track which image is being deleted
                    return (
                      <div key={index} className="relative group">
                        <div className="aspect-square overflow-hidden rounded-lg border">
                          <Image
                            src={imageUrl}
                            alt={`Property image ${index + 1}`}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleImageDelete(imageUrl)}
                          disabled={isDeleting}
                          className="absolute top-2 right-2 p-1 bg-red-500 rounded-full md:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          {isDeleting ? (
                            <Loader2 className="h-4 w-4 text-white animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-white" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <div>
            {existingPanoramicImages.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">
                  Current Panoramic Images
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {existingPanoramicImages.map((imageUrl, index) => {
                  const isDeleting = deletingPanoramicImages.includes(imageUrl);
                  return (
                    <div key={index} className="relative group">
                      <div className="aspect-square overflow-hidden rounded-lg border">
                        <Image
                          src={imageUrl}
                          alt={`Property image ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePanaromicImageDelete(imageUrl)}
                        disabled={isDeleting}
                        className="absolute top-2 right-2 p-1 bg-red-500 rounded-full md:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 text-white animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-white" />
                        )}
                      </button>
                    </div>
                  );
                })}
                </div>
              </div>
            )}
          </div>

          {/* Images Upload Field */}
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add Additional Images</FormLabel>
                <FormControl>
                  <div
                    {...getRegularRootProps()}
                    className={cn(
                      "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                      isRegularDragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500"
                    )}
                  >
                    <input {...getRegularInputProps()} />
                    {isRegularDragActive ? (
                      <p className="text-blue-500">
                        Drop regular images here...
                      </p>
                    ) : (
                      <div>
                        <p className="text-gray-500">
                          Drag & drop regular images here, or click to select
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-2 cursor-pointer"
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = "image/jpeg,image/png,image/gif";
                            input.multiple = true;
                            input.onchange = (e) => {
                              const files = Array.from(
                                (e.target as HTMLInputElement).files || []
                              );
                              handleAddFiles(files);
                            };
                            input.click();
                          }}
                        >
                          Select Regular Images
                        </Button>
                      </div>
                    )}
                  </div>
                </FormControl>
                <p className="text-sm text-gray-500 mt-1">
                  Max 20 images, 5MB each (JPEG, PNG, GIF).
                </p>

                {/* Regular Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 md:grid-cols-8 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="relative group animate-in fade-in duration-300"
                      >
                        <Image
                          src={preview}
                          alt={`Regular Preview ${index + 1}`}
                          width={5}
                          height={5}
                          className="w-full h-24 object-cover rounded-lg shadow-sm"
                        />
                        <Button
                          variant="ghost"
                          type="button"
                          onClick={() => removePreview(index, "regular")}
                          className="absolute top-1 right-1 rounded-full w-6 h-6 flex items-center justify-center text-red-700 bg-red-100 cursor-pointer hover:bg-red-200 hover:text-red-800"
                          aria-label={`Remove regular image ${index + 1}`}
                        >
                          <Trash2 strokeWidth={2.5} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Panoramic Images Upload Field */}
          <FormField
            control={form.control}
            name="panoramicImages"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Add Additional Panoramic Images for 360° view
                </FormLabel>
                <FormControl>
                  <div
                    {...getPanoramicRootProps()}
                    className={cn(
                      "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                      isPanoramicDragActive
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-300 hover:border-gray-400",
                      "focus:outline-none focus:ring-2 focus:ring-purple-500"
                    )}
                  >
                    <input {...getPanoramicInputProps()} />
                    {isPanoramicDragActive ? (
                      <p className="text-purple-500">
                        Drop panoramic images here...
                      </p>
                    ) : (
                      <div>
                        <p className="text-gray-500">
                          Drag & drop panoramic images here, or click to select
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-2"
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = "image/jpeg,image/png,image/gif";
                            input.multiple = true;
                            input.onchange = (e) => {
                              const files = Array.from(
                                (e.target as HTMLInputElement).files || []
                              );
                              handleAddPanoramicFiles(files);
                            };
                            input.click();
                          }}
                        >
                          Select Panoramic Images
                        </Button>
                      </div>
                    )}
                  </div>
                </FormControl>
                <p className="text-sm text-gray-500 mt-1">
                  Max 10 images, 5MB each (JPEG, PNG, GIF).
                </p>

                {/* Panoramic Image Previews */}
                {panoramicPreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 md:grid-cols-8 gap-4">
                    {panoramicPreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="relative group animate-in fade-in duration-300"
                      >
                        <Image
                          src={preview}
                          alt={`Panoramic Preview ${index + 1}`}
                          width={5}
                          height={5}
                          className="w-full h-24 object-cover rounded-lg shadow-sm"
                        />
                        <Button
                          variant="ghost"
                          type="button"
                          onClick={() => removePreview(index, "panoramic")}
                          className="absolute top-1 right-1 rounded-full w-6 h-6 flex items-center justify-center text-red-700 bg-red-100 cursor-pointer hover:bg-red-200 hover:text-red-800"
                          aria-label={`Remove panoramic image ${index + 1}`}
                        >
                          <Trash2 strokeWidth={2.5} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Additional Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="furnished"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Furnished</FormLabel>
                    <FormDescription>
                      Is the property furnished?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      className="cursor-pointer"
                      checked={field.value === "Yes"}
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? "Yes" : "No")
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Amenities */}
          <FormField
            control={form.control}
            name="amenities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amenities</FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-3">
                      {amenities.map((amenity, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center justify-center py-2 rounded-full bg-sky-100 text-sky-800 text-sm"
                        >
                          {amenity}
                          <Button
                            type="button"
                            onClick={() => removeAmenity(index)}
                            className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 w-0 bg-sky-50 text-red-800 cursor-pointer h-0 p-3"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        className="h-10"
                        placeholder="Add an amenity and press Enter or the add button"
                        value={amenityInput}
                        onChange={(e) => setAmenityInput(e.target.value)}
                        onKeyDown={handleAmenityKeyDown}
                        onBlur={() => {
                          if (amenityInput.trim()) addAmenity();
                        }}
                      />
                      <Button
                        className="cursor-pointer bg-sky-600 hover:bg-sky-600/80 font-semibold hover:text-white text-white"
                        type="button"
                        variant="outline"
                        onClick={addAmenity}
                        disabled={!amenityInput.trim()}
                      >
                        Add
                        <Plus strokeWidth={3} />
                      </Button>
                    </div>
                  </div>
                </FormControl>
                <FormDescription>
                  Add amenities one by one (e.g., Parking, Gym, Pool)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="bg-sky-600 hover:bg-sky-600/80 cursor-pointer md:text-lg md:font-semibold md:py-6 w-full"
          >
            {form.formState.isSubmitting
              ? "Updating Property ..."
              : `Update Property`}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PropertyUpdateForm;
