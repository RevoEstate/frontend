import { CompaniesTable } from "@/components/system-admin/companies/companies-table"
import { SearchAndFilter } from "@/components/system-admin/companies/search-filter"
import { ExportButton } from "@/components/system-admin/companies/export-button"

export default function CompaniesPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Registered Companies</h1>
        <p className="text-muted-foreground">Manage and monitor registered companies on the platform</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <SearchAndFilter />
        <ExportButton />
      </div>

      <CompaniesTable />
    </div>
  )
}
