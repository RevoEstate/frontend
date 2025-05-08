"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Form validation schema
const formSchema = z.object({
  packageName: z.string().min(3, {
    message: "Package name must be at least 3 characters.",
  }),
  packagePrice: z.object({
    usd: z.coerce.number().min(0, {
      message: "USD price must be a positive number.",
    }),
    etb: z.coerce.number().min(0, {
      message: "ETB price must be a positive number.",
    }),
  }),
  packageDuration: z.coerce.number().min(1, {
    message: "Duration must be at least 1 month.",
  }),
  packageType: z.enum(["premium", "standard"], {
    required_error: "Please select a package type.",
  }),
  packageDescription: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  numberOfProperties: z.coerce.number().min(1, {
    message: "Number of properties must be at least 1.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreatePackageForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      packageName: "",
      packagePrice: {
        usd: 0,
        etb: 0,
      },
      packageDuration: 1,
      packageType: "standard",
      packageDescription: "",
      numberOfProperties: 1,
    },
  });

  // Create package mutation
  const createPackage = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await axiosInstance.post("/v1/packages", data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate packages query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["packages"] });

      toast.success("Package created successfully");

      // Navigate back to packages list
      router.push("/dashboard/packages");
    },
    onError: (error: any) => {
      toast.error("Error creating package");
      setIsSubmitting(false);
    },
  });

  // Form submission handler
  function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    createPackage.mutate(values);
  }

  // Auto-calculate ETB price based on USD price (example conversion rate)
  const handleUsdPriceChange = (value: string) => {
    const usdPrice = Number.parseFloat(value);
    if (!isNaN(usdPrice)) {
      // Example conversion rate: 1 USD = 55 ETB
      const etbPrice = usdPrice * 55;
      form.setValue("packagePrice.etb", etbPrice);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl"
      >
        <FormField
          control={form.control}
          name="packageName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Package Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter package name" {...field} />
              </FormControl>
              <FormDescription>
                A unique name for this subscription package.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="packagePrice.usd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (USD)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleUsdPriceChange(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="packagePrice.etb"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (ETB)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="packageDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (Months)</FormLabel>
                <FormControl>
                  <Input type="number" min="1" placeholder="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numberOfProperties"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Properties</FormLabel>
                <FormControl>
                  <Input type="number" min="1" placeholder="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="packageType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Package Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select package type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Premium packages offer more features than standard packages.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="packageDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter package description"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Describe the features and benefits of this package.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Package"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/packages")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
