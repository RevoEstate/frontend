import { DateRangePicker } from "@/components/system-admin/analytics/date-range-picker"
import { KeyMetrics } from "@/components/system-admin/analytics/key-metrics"
import { RegistrationChart } from "@/components/system-admin/analytics/registration-chart"
import { PropertyTypeChart } from "@/components/system-admin/analytics/property-type-chart"
import { TrafficChart } from "@/components/system-admin/analytics/traffic-chart"
import { DetailedReports } from "@/components/system-admin/analytics/detailed-reports"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Monitor platform performance and user activity</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <DateRangePicker />
      </div>

      <KeyMetrics />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RegistrationChart />
        <PropertyTypeChart />
        <TrafficChart />
      </div>

      <DetailedReports />
    </div>
  )
}
