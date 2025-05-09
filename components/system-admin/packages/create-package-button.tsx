"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreatePackageButton() {
  const router = useRouter();

  return (
    <Button onClick={() => router.push("/dashboard/packages/create")}>
      <Plus className="mr-2 h-4 w-4" /> Create Package
    </Button>
  );
}
