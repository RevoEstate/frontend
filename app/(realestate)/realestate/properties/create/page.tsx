"use client";

import PropertyForm from "@/components/realestate/PropertyForm";
import { useActivePackage } from "@/hooks/useActivePackage";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useState } from "react";

const ActivePackageCard = ({
  pkg,
  onSelect,
  isSelected,
}: {
  pkg: any;
  onSelect: () => void;
  isSelected: boolean;
}) => {
  const isPremium = pkg?.packageId?.packageType === "premium";
  const daysRemaining = Math.ceil(
    (new Date(pkg?.expireDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const propertiesRemaining =
    pkg?.maxnumberOfProperties - pkg?.numberOfProperties;

  return (
    <Card
      className={`relative overflow-hidden transition-all ${
        isSelected && isPremium ? "" : ""
      } ${isPremium ? "border-amber-500" : "border-sky-500"}`}
    >
      {isPremium && (
        <div className="absolute top-0 right-0 bg-amber-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
          Premium
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-xl">{pkg?.packageId?.packageName}</CardTitle>
        <CardDescription>{pkg?.packageId?.packageDescription}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Price</span>
          <span className="font-medium">
            {pkg?.paymentMethod === "stripe"
              ? `$${pkg?.price?.usd.toFixed(2)}`
              : `${pkg?.price?.etb.toFixed(2)} Birr`}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Properties</span>
          <span className="font-medium">
            {pkg?.numberOfProperties} / {pkg?.maxnumberOfProperties} used
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Remaining</span>
          <span
            className={`font-medium ${
              propertiesRemaining <= 2 ? "text-amber-600" : "text-green-600"
            }`}
          >
            {propertiesRemaining} properties
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Expires in</span>
          <span
            className={`font-medium ${
              daysRemaining <= 7 ? "text-amber-600" : "text-green-600"
            }`}
          >
            {daysRemaining} days
          </span>
        </div>

        <Button
          onClick={onSelect}
          disabled={propertiesRemaining <= 0}
          className={`w-full mt-3 ${
            isSelected
              ? "bg-sky-200 hover:bg-sky-200 text-gray-400"
              : isPremium
                ? "bg-amber-600 hover:bg-amber-700 cursor-pointer"
                : "bg-sky-600 hover:bg-sky-600/80 cursor-pointer"
          }`}
        >
          {isSelected ? "Selected" : "Select Package"}
        </Button>
      </CardContent>
    </Card>
  );
};

const CreatePropertyPage = () => {
  const { data: activePackages, isLoading, error } = useActivePackage();
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null
  );

  if (isLoading) {
    return (
      <div className="flex gap-3 text-muted-foreground items-center justify-center min-h-[300px] text-sm">
        <Loader2 className="h-5 w-5 animate-spin" />
        <p>Loading your packages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-5 p-4">
        <div className="text-center max-w-md p-6 border rounded-lg bg-red-50">
          <h2 className="text-xl font-semibold mb-2 text-red-600">
            Error Loading Active Packages
          </h2>
          <p className="mb-4 text-red-500">{error.message}</p>
          <Button asChild variant="ghost" className="cursor-pointer">
            <Link href="/realestate/packages/my-packages">
              Back to your Packages
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!activePackages?.length && !selectedPackageId) {
    return (
      <div className="flex flex-col items-center gap-5 p-8 md:w-[50vw] mx-auto border-1 shadow-lg mt-15">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No active packages found</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            You need an active package to create properties.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
            <Button variant="ghost" asChild className="cursor-pointer">
              <Link href="/realestate/packages/my-packages">
                Check your Packages
              </Link>
            </Button>
            <p className="text-sm font-bold text-sky-600">or</p>
            <Button variant="ghost" asChild className="cursor-pointer">
              <Link href="/realestate/packages">Purchase a Package</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (activePackages?.length && !selectedPackageId) {
    return (
      <div className="flex flex-col items-center gap-5 p-4">
        <h1 className="text-xl md:text-4xl font-bold text-center border-b-1 pb-2 shadow-2xl p-3 rounded-2xl">
          Create Property
        </h1>
        <div className="w-full max-w-4xl">
          <h2 className="text-lg font-semibold mb-4 text-center">
            Select a Package to create property
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activePackages.map((pkg) => (
              <ActivePackageCard
                key={pkg._id}
                pkg={pkg}
                onSelect={() => setSelectedPackageId(pkg._id)}
                isSelected={false}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 p-4">
      <h1 className="text-xl md:text-4xl font-bold text-center border-b-1 pb-2 shadow-2xl p-3 rounded-2xl">
        Create Property
      </h1>
      <div className="w-full max-w-4xl">
        <Button
          variant="ghost"
          className="mb-4 gap-1 pl-0 cursor-pointer bg-sky-300 hover:bg-sky-300/90 hover:font-semibold"
          onClick={() => setSelectedPackageId(null)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="mb-6 w-[300px]">
          <h2 className="text-lg font-semibold mb-2">Selected Package</h2>
          {activePackages
            ?.filter((p) => p._id === selectedPackageId)
            .map((pkg) => (
              <ActivePackageCard
                key={pkg._id}
                pkg={pkg}
                onSelect={() => {}}
                isSelected={true}
              />
            ))}
        </div>
        <PropertyForm packageId={selectedPackageId} />
      </div>
    </div>
  );
};

export default CreatePropertyPage;
