import type { Metadata } from "next";
import PackagesTable from "@/components/system-admin/packages/packages-table";
import PackageFilterBar from "@/components/system-admin/packages/package-filter-bar";
import CreatePackageButton from "@/components/system-admin/packages/create-package-button";

export const metadata: Metadata = {
  title: "Packages | Dashboard",
  description: "Manage subscription packages for your platform",
};

export default function PackagesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Packages</h2>
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
