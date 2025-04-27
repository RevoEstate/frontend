"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export function PackageDetail({
  packageData,
  packageId,
}: {
  packageData: any;
  packageId: string;
}) {
  const handleCheckout = async () => {
    // Stripe implementation here
  };

  const isPremium = packageData.packageType === "premium";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {packageData.packageName}
          </h1>
          <p className="text-xl text-gray-600">
            {packageData.packageDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="relative h-64 w-full rounded-t-lg overflow-hidden">
                  <Image
                    src={packageData.imageUrl}
                    alt={packageData.packageName}
                    fill
                    className="object-cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">
                    Package Type
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${isPremium ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}`}
                  >
                    {packageData.packageType}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">
                    Duration
                  </span>
                  <span className="text-gray-900 font-medium">
                    {packageData.packageDuration} days
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">
                    Properties Limit
                  </span>
                  <span className="text-gray-900 font-medium">
                    {packageData.numberOfProperties} properties
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">USD Price</span>
                    <span className="text-3xl font-bold text-gray-900">
                      ${packageData.packagePrice.usd}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">ETB Price</span>
                    <span className="text-2xl font-bold text-gray-900">
                     {packageData.packagePrice.etb} Birr
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                      List up to {packageData.numberOfProperties} properties
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
                    <span>{packageData.packageDuration}-day duration</span>
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
                      {isPremium ? "Priority" : "Standard"} customer support
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
                      {isPremium ? "Featured" : "Standard"} property listings
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardContent>
                <Button
                  onClick={handleCheckout}
                  className={`w-full py-6 text-lg ${isPremium ? "bg-amber-600 hover:bg-amber-700" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                  Purchase Package
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
