import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CreatePackageForm } from "@/components/system-admin/packages/create-package-form";

export default function CreatePackagePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Create Package</h1>
        <Button variant="outline" size="sm" asChild>
          <a href="/dashboard/packages">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Packages
          </a>
        </Button>
      </div>
      <Separator />
      <CreatePackageForm />
    </div>
  );
}
