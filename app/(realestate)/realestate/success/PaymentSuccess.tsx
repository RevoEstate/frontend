"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) {
        setError("No session ID provided.");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/payment/gettransaction/${sessionId}`,
          { withCredentials: true }
        );

        if (response.status === 200 && response.data.success) {
          setTransactionDetails(response.data.data);
        } else {
          setError(response.data.message || "Failed to retrieve transaction.");
        }
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "An error occurred while fetching transaction details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
        <p className="ml-2 text-gray-600">Loading transaction details...</p>
      </div>
    );
  }

  if (error || !transactionDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Payment Error
            </CardTitle>
            <p className="mt-2 text-red-500">
              {error || "No transaction details available."}
            </p>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-sky-600 hover:bg-sky-600/90">
              <Link href="/realestate/packages">Try Again</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format price based on payment method
  const price =
    transactionDetails.paymentMethod === "stripe"
      ? `$${transactionDetails.price.usd.toFixed(2)}`
      : `${transactionDetails.price.etb.toFixed(2)} ETB`;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="max-w-lg w-full shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Payment Successful!
          </CardTitle>
          <p className="mt-2 text-muted-foreground text-sm">
            Thank you for your purchase, {transactionDetails.realEstateName}.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 py-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-medium text-gray-900">
                {transactionDetails.transactionId}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Amount</span>
              <span className="font-medium text-gray-900">{price}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium text-gray-900 capitalize">
                {transactionDetails.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date</span>
              <span className="font-medium text-gray-900">
                {new Date(transactionDetails.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Package</span>
              <span className="font-medium text-gray-900">
                {transactionDetails.maxnumberOfProperties} Properties
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Expiry Date</span>
              <span className="font-medium text-gray-900">
                {new Date(transactionDetails.expireDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Real Estate</span>
              <span className="font-medium text-gray-900">
                {transactionDetails?.companyId?.realEstateName}
              </span>
            </div>
          </div>
          <div className="border-t pt-6">
            <div className="flex gap-4">
              <Button asChild className="w-full bg-sky-600 hover:bg-sky-600/90">
                <Link href="/realestate/packages">View Packages</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
