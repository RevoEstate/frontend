import { SubAccountsTable } from "@/components/system-admin/sub-accounts/sub-accounts-table"
import { SubAccountSearch } from "@/components/system-admin/sub-accounts/sub-account-search"
import { CreateSubAccountButton } from "@/components/system-admin/sub-accounts/create-sub-account-button"
import { ActivityLog } from "@/components/system-admin/sub-accounts/activity-log"

export default function SubAccountManagementPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Sub-Account Management</h1>
        <p className="text-muted-foreground">Manage manager and sub-admin accounts</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <SubAccountSearch />
        <CreateSubAccountButton />
      </div>

      <SubAccountsTable />
      <ActivityLog />
    </div>
  )
}
