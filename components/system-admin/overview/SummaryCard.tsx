"use client";
import React from "react";
import Badge from "../../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import {
  FaFile,
  FaBuilding,
  FaFlag,
  FaUsers,
  FaShieldAlt,
  FaSignOutAlt,
  FaQuestion,
} from "react-icons/fa";
import { IoBarChartSharp, IoChatboxEllipses, IoHome } from "react-icons/io5";
import { useOverviewStats } from "@/hooks/useStats";
import useUIStore from "@/stores/uiStore";
import { useEffect } from "react";

export const SummaryCard = () => {
  const { stats, isLoading, error, refreshStats } = useOverviewStats();
  const { isRefreshEnabled, toggleRefresh } = useUIStore();

  // Auto-refresh stats when isRefreshEnabled is true
  useEffect(() => {
    if (!isRefreshEnabled) return;
    const interval = setInterval(() => {
      refreshStats();
    }, 900000); // Refresh every 15 minutes (900,000 ms)
    return () => clearInterval(interval);
  }, [isRefreshEnabled, refreshStats]);

  if (isLoading) return <div>Loading stats...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!stats) return <div>No stats available.</div>;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <FaBuilding className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-center mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Companies
            </span>
            <h4 className="mt-2 font-bold text-[#8BC34A] text-title-sm">
              {stats.totalCompanies}+
            </h4>
          </div>
          {/* <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge> */}
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <FaQuestion className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end  justify-center mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Pending requests
            </span>
            <h4 className="mt-2 font-bold text-[#CCFF00] text-title-sm">
              {stats.pendingCompanyRequests}
            </h4>
          </div>
          {/* <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge> */}
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <FaFlag className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-center mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Reports
            </span>
            <h4 className="mt-2 font-bold text-[#FF0000] text-title-sm">
              {stats.totalReports}
            </h4>
          </div>

          {/* <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            9.05%
          </Badge> */}
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <IoChatboxEllipses className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-center mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Issues
            </span>
            <h4 className="mt-2 font-bold text-[#0000FF] text-title-sm">
              {stats.totalIssues}
            </h4>
          </div>

          {/* <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            9.05%
          </Badge> */}
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
