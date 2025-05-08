"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CreatePackageButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push("/dashboard/packages/create")}
      className="flex items-center gap-2"
    >
      <Plus className="h-4 w-4" />
      Create Package
    </Button>
  );
}
