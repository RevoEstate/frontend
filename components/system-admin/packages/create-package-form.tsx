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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Form validation schema
const formSchema = z.object({
  packageName: z.string().min(3, "Package name must be at least 3 characters"),
  packagePrice: z.object({
    usd: z.coerce.number().min(1, "USD price must be at least 1"),
    etb: z.coerce.number().min(1, "ETB price must be at least 1"),
  }),
  packageDuration: z.coerce
    .number()
    .min(1, "Duration must be at least 1 month"),
  packageType: z.enum(["premium", "standard"]),
  numberOfProperties: z.coerce
    .number()
    .min(1, "Number of properties must be at least 1"),
  packageDescription: z
    .string()
    .min(10, "Description must be at least 10 characters"),
});

export function CreatePackageForm() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [exchangeRate, setExchangeRate] = useState(55); // Default ETB to USD exchange rate

  // Create package mutation
  const createPackageMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await axiosInstance.post(
        "/v1/system-admin/createpackage",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      toast({
        title: "Package created",
        description: "The package has been created successfully.",
      });
      router.push("/dashboard/packages");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to create package: ${error.message}`,
      });
    },
  });

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      packageName: "",
      packagePrice: {
        usd: 0,
        etb: 0,
      },
      packageDuration: 1,
      packageType: "standard",
      numberOfProperties: 1,
      packageDescription: "",
    },
  });

  // Handle USD price change to auto-calculate ETB
  const handleUsdPriceChange = (value: string) => {
    const usdPrice = Number.parseFloat(value) || 0;
    const etbPrice = usdPrice * exchangeRate;
    form.setValue("packagePrice.etb", Math.round(etbPrice * 100) / 100);
  };

  // Handle ETB price change to auto-calculate USD
  const handleEtbPriceChange = (value: string) => {
    const etbPrice = Number.parseFloat(value) || 0;
    const usdPrice = etbPrice / exchangeRate;
    form.setValue("packagePrice.usd", Math.round(usdPrice * 100) / 100);
  };

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createPackageMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {createPackageMutation.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {(createPackageMutation.error as Error).message}
            </AlertDescription>
          </Alert>
        )}

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
                The name of the package as it will appear to customers.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="packagePrice.usd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (USD)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleUsdPriceChange(e.target.value);
                    }}
                  />
                </FormControl>
                <FormDescription>The price in US Dollars.</FormDescription>
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
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleEtbPriceChange(e.target.value);
                    }}
                  />
                </FormControl>
                <FormDescription>The price in Ethiopian Birr.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="packageDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (Months)</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormDescription>
                  How long the package is valid for.
                </FormDescription>
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
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormDescription>
                  Maximum number of properties allowed.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="packageType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Package Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="standard" />
                    </FormControl>
                    <FormLabel className="font-normal">Standard</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="premium" />
                    </FormControl>
                    <FormLabel className="font-normal">Premium</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormDescription>Select the type of package.</FormDescription>
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
                  placeholder="Enter a detailed description of the package"
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Describe what's included in this package.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/dashboard/packages")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={createPackageMutation.isPending}>
            {createPackageMutation.isPending ? "Creating..." : "Create Package"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
