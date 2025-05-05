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

export const SummaryCard = () => {
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
              Companies
            </span>
            <h4 className="mt-2 font-bold text-[#8BC34A] text-title-sm">50+</h4>
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
            <h4 className="mt-2 font-bold text-[#CCFF00] text-title-sm">7</h4>
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
            <h4 className="mt-2 font-bold text-[#FF0000] text-title-sm">22</h4>
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
            <h4 className="mt-2 font-bold text-[#0000FF] text-title-sm">4</h4>
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
