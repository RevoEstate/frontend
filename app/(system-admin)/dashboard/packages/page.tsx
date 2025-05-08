import type { Metadata } from "next";
import PackageFilterBar from "@/components/system-admin/packages/package-filter-bar";
import PackagesTable from "@/components/system-admin/packages/packages-table";
import CreatePackageButton from "@/components/system-admin/packages/create-package-button";

export const metadata: Metadata = {
  title: "Packages | Dashboard",
  description: "Manage subscription packages for your platform",
};

export default function PackagesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Packages</h1>
          <p className="text-muted-foreground">
            Manage subscription packages for your platform
          </p>
        </div>
        <CreatePackageButton />
      </div>

      <PackageFilterBar />
      <PackagesTable />
    </div>
  );
}
