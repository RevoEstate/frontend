import React from "react";
import type { Metadata } from "next";
import {
  APP_DESCRIPTION,
  APP_NAME,
  SERVER_URL,
} from "@/lib/constants/index.ts";
import { SummaryCard } from "@/components/system-admin/overview/SummaryCard";
import DataTable from "@/components/system-admin/overview/DataTable";
import StatisticsChart from "@/components/system-admin/overview/StatisticsChart";
// import QuickActions from "@/components/admin/QuickActions";
import RecentActivity from "@/components/system-admin/overview/RecentActivity";

export const metadata: Metadata = {
  title: {
    template: `%s | RevoEstate`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: SERVER_URL,
    siteName: APP_NAME,
    images: [
      {
        url: `${SERVER_URL}/og-image.png`,
        width: 1200,
        height: 630,
      },
    ],
    locale: "en-US",
    type: "website",
  },
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-12">
        <SummaryCard />
      </div>
      {/* 
      <div className="col-span-12 xl:col-span-12">
        <QuickActions />
      </div> */}

      <div className="col-span-12 xl:col-span-12">
        <RecentActivity />
      </div>

      <div className="col-span-12 xl:col-span-12">
        <DataTable />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>
    </div>
  );
}
