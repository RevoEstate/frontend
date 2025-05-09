"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EditPackageForm } from "@/components/system-admin/packages/edit-package-form";
import { use } from "react";
export default function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Edit Package</h1>
        <Button variant="outline" size="sm" asChild>
          <a href={`/dashboard/packages/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Package
          </a>
        </Button>
      </div>
      <Separator />
      <EditPackageForm packageId={id} />
    </div>
  );
}
