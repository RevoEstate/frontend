import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Payment Successful!
          </CardTitle>
          <p className="mt-2 text-muted-foreground text-sm">
            Thank you for your purchase. Your payment has been processed successfully.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 py-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-medium text-gray-900">TXN123456789</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Amount</span>
              <span className="font-medium text-gray-900">$99.99</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date</span>
              <span className="font-medium text-gray-900">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="border-t pt-6">
            <p className="text-sm text-muted-foreground text-center mb-4">
              A confirmation email has been sent to your registered email address.
            </p>
            <Link href="/realestate/packages">
              <Button className="w-full bg-sky-600 hover:bg-sky-600/90 transition-colors cursor-pointer">
                Check your Packages
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}