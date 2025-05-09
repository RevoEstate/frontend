import { PoliciesTable } from "@/components/system-admin/policies/policies-table"
import { AddPolicyButton } from "@/components/system-admin/policies/add-policy-button"
import { PolicyAuditLog } from "@/components/system-admin/policies/policy-audit-log"

export default function PlatformPoliciesPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Platform Policies</h1>
        <p className="text-muted-foreground">Manage and update platform policies and terms</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">{/* Search input could go here if needed */}</div>
        <AddPolicyButton />
      </div>

      <PoliciesTable />
      {/* <PolicyAuditLog /> */}
    </div>
  )
}
