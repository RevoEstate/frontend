'use client';
import React from "react";
import { useRouter } from "next/navigation";

export default function QuickActions() {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Quick Actions
          </h3>
        </div>
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => router.push("/company-applications")}
          className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition duration-200"
        >
          View Pending Applications
        </button>
        <button
          onClick={() => router.push("/content-reports")}
          className="w-full px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow transition duration-200"
        >
          Check New Reports
        </button>
        <button
          onClick={() => router.push("/company-applications")}
          className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition duration-200"
        >
          View Pending Applications
        </button>
        <button
          onClick={() => router.push("/content-reports")}
          className="w-full px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow transition duration-200"
        >
          Check New Reports
        </button>
      </div>
    </div>
  );
}
