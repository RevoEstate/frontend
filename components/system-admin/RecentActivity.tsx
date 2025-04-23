"use client"

import { recentActivities } from "@/data/recentActivities"
import { RecentTable } from "./RecentTable"
import { formatDate } from "@/utils/formatDate"
import { Button } from "@/components/ui/button"
import { Filter, ChevronRight } from "lucide-react"

export default function RecentActivity() {
  const columns = [
    { header: "Description", accessor: "description" },
    { header: "Actor", accessor: "actor.name" },
    { header: "Date", accessor: "date" },
  ]

  const formattedData = recentActivities.map((activity) => ({
    ...activity,
    date: formatDate(activity.date),
  }))

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white px-6 pb-4 pt-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Recent Activities</h3>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            See all
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <RecentTable columns={columns} data={formattedData} />
    </div>
  )
}
