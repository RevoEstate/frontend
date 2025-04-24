"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePackageById } from "@/hooks/usePackageById";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";

const PackageDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const Params = React.use(params);
  const id = Params.id;

  const { data: packageData, isLoading, error } = usePackageById(id);

  if (isLoading) {
    return (
      <header className="flex items-center justify-center mt-10">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="bg-gray-100 hover:bg-gray-100 cursor-wait"
            disabled
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </Button>
        </div>
      </header>
    );
  }

  if (error) {
    return (
      <header className="flex items-center justify-between">
        <Alert variant="destructive" className="w-auto">
          <AlertDescription className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {error.message}
          </AlertDescription>
        </Alert>
      </header>
    );
  }
  const Handlepayment = async (paymentMethod: string) => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/payment/purchasepackage`,
      {
        paymentMethod,
        price: packageData?.packagePrice,
      },
      {
        withCredentials: true,
      }
    );
    // console.log("Payment Response: ", res);
    window.location.href = res.data?.data;
  };
  const HandlepaymentChappa = async (paymentMethod: string) => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/payment/purchasepackage`,
      {
        paymentMethod,
        price: packageData?.packagePrice,
      },
      {
        withCredentials: true,
      }
    );
    console.log("Payment Response: ", res);
    if (!res.data?.data) {
      console.error("Redirect URL is undefined or null:", res.data);
      throw new Error("Invalid redirect URL from payment API");
    }

    window.location.href = res.data?.data;
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
            {packageData?.packageName}
          </h1>
          <p className="text-sm md:text-normal text-muted-foreground">
            {packageData?.packageDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="border-1 shadow-md">
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    Package Type
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${packageData?.packageType === "premium" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}`}
                  >
                    {packageData?.packageType}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    Duration
                  </span>
                  <span className="text-gray-900 font-medium">
                    {packageData?.packageDuration} days
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    Properties Limit
                  </span>
                  <span className="text-gray-900 font-medium">
                    {packageData?.numberOfProperties} properties
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-muted-foreground">
                      USD Price
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      ${packageData?.packagePrice?.usd}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-muted-foreground">
                      ETB Price
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      {packageData?.packagePrice?.etb} Birr
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>
                      List up to {packageData?.numberOfProperties} properties
                    </span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{packageData?.packageDuration}-day duration</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>
                      {packageData?.packageType === "premium"
                        ? "Priority"
                        : "Standard"}{" "}
                      customer support
                    </span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>
                      {packageData?.packageType === "premium"
                        ? "Featured"
                        : "Standard"}{" "}
                      property listings
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardContent>
                <Button
                  size="lg"
                  className="w-full bg-emerald-600 text-lg font-semibold hover:bg-emerald-600/80 cursor-pointer"
                  onClick={() => HandlepaymentChappa("chapa")}
                >
                  Pay with Chapa
                </Button>
              </CardContent>
              <CardContent>
                <Button
                  size="lg"
                  className="w-full bg-sky-500 text-lg font-bold hover:bg-sky-500/80 cursor-pointer"
                  onClick={() => Handlepayment("stripe")}
                >
                  Pay with Stripe
                </Button>
              </CardContent>
              <CardContent>
                <Button
                  size="lg"
                  className="w-full bg-yellow-600 text-lg font-bold hover:bg-yellow-600/80 cursor-pointer"
                >
                  Pay with Paypal
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailPage;
