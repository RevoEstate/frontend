import { DashboardLayout } from "@/components/dashboard-layout";
import { PropertyDashboard } from "@/components/propertyDashboard";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <PropertyDashboard />
    </DashboardLayout>
  );
}
