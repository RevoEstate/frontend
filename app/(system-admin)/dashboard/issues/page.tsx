import { IssuesTable } from "@/components/system-admin/issues/issues-table"
import { IssueFilterBar } from "@/components/system-admin/issues/issue-filter-bar"

export default function IssueResolutionPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Issue Resolution</h1>
        <p className="text-muted-foreground">Manage and respond to issues raised by users and companies</p>
      </div>

      <IssueFilterBar />
      <IssuesTable />
    </div>
  )
}
