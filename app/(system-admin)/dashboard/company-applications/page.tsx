import { ApplicationsTable } from "@/components/system-admin/company-applications/applications-table"
import { SearchBar } from "@/components/system-admin/company-applications/search-bar"

export default function ApplicationsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Company Applications
        </h1>
        <p className="text-muted-foreground">
          Manage and review company applications
        </p>
      </div>
      <SearchBar />
      <ApplicationsTable />
    </div>
  );
}
