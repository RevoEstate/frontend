import { ContentReportsTable } from "@/components/system-admin/reports/reports-table"
import { ReportFilterBar } from "@/components/system-admin/reports/report-filter-bar"

export default function ContentReportsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Content Reports</h1>
        <p className="text-muted-foreground">Manage and review content reported by users for policy violations</p>
      </div>

      <ReportFilterBar />
      <ContentReportsTable />
    </div>
  )
}
