"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, LayoutDashboard, User, Settings, Building } from "lucide-react";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Properties",
    href: "/dashboard/my-properties",
    icon: Building,
  },
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white">
      <div className="p-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-xl font-semibold"
        >
          <Home className="h-6 w-6" />
          <span>Dashboard</span>
        </Link>
      </div>
      <nav className="mt-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors",
                  pathname === item.href && "bg-gray-800 text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
