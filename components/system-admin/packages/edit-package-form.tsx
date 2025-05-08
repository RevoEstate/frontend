"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePackage } from "@/hooks/usePackage";
import {
  useUpdatePackage,
  type UpdatePackageData,
} from "@/hooks/useUpdatePackage";
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

interface EditPackageFormProps {
  packageId: string;
}

export function EditPackageForm({ packageId }: EditPackageFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const {
    package: packageData,
    isLoading,
    error: fetchError,
  } = usePackage(packageId);
  const { updatePackage, isUpdating, error: updateError } = useUpdatePackage();
  const [exchangeRate, setExchangeRate] = useState(55); // Default ETB to USD exchange rate

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

  // Update form values when package data is loaded
  useEffect(() => {
    if (packageData) {
      form.reset({
        packageName: packageData.packageName,
        packagePrice: {
          usd: packageData.packagePrice.usd,
          etb: packageData.packagePrice.etb,
        },
        packageDuration: packageData.packageDuration,
        packageType: packageData.packageType,
        numberOfProperties: packageData.numberOfProperties,
        packageDescription: packageData.packageDescription,
      });

      // Calculate exchange rate from existing data
      if (packageData.packagePrice.usd > 0) {
        const calculatedRate =
          packageData.packagePrice.etb / packageData.packagePrice.usd;
        setExchangeRate(calculatedRate);
      }
    }
  }, [packageData, form]);

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
    if (!packageId) return;

    const updateData: UpdatePackageData = {
      packageName: values.packageName,
      packagePrice: {
        usd: values.packagePrice.usd,
        etb: values.packagePrice.etb,
      },
      packageDuration: values.packageDuration,
      packageType: values.packageType,
      numberOfProperties: values.numberOfProperties,
      packageDescription: values.packageDescription,
    };

    updatePackage(
      { id: packageId, data: updateData },
      {
        onSuccess: () => {
          toast({
            title: "Package updated",
            description: "The package has been updated successfully.",
          });
          router.push(`/dashboard/packages/${packageId}`);
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: `Failed to update package: ${error.message}`,
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-red-500 text-lg">
          Error loading package: {fetchError}
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/packages")}
        >
          Back to Packages
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {(fetchError || updateError) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{fetchError || updateError}</AlertDescription>
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
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update Package"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
