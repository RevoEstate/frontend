import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreatePackageForm from "@/components/system-admin/packages/create-package-form";

export const metadata: Metadata = {
  title: "Create Package | Dashboard",
  description: "Create a new subscription package",
};

export default function CreatePackagePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/packages">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to packages</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Create Package</h1>
      </div>

      <CreatePackageForm />
    </div>
  );
}
