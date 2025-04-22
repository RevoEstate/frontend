"use client";
import { Button } from "@/components/ui/button";

export function CheckoutButton({
  packageId,
  isPremium,
}: {
  packageId: string;
  isPremium: boolean;
}) {
  const handleCheckout = async () => {
    // Implement checkout logic (e.g., call a payment API)
    console.log(`Initiating checkout for package ${packageId}`);
    // Example: await fetch('/api/checkout', { method: 'POST', body: JSON.stringify({ packageId }) });
  };

  return (
    <Button
      onClick={handleCheckout}
      className={`w-full py-6 text-lg ${
        isPremium
          ? "bg-amber-600 hover:bg-amber-700"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      Purchase Package
    </Button>
  );
}
