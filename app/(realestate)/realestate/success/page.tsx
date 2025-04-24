// app/(realestate)/realestate/success/page.tsx
import { Suspense } from "react";
import PaymentSuccess from "./PaymentSuccess";

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <PaymentSuccess />
    </Suspense>
  );
}
