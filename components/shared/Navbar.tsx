"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import UserMenu from "../auth/UserMenu";

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  const user = useCurrentUser();


  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 50) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 w-screen bg-white/30 dark:bg-gray-900/80 z-50 backdrop-blur-md overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-800 bg-clip-text text-transparent">
              RevoEstate
            </h1>
          </Link>

           {/* Desktop Navigation */}
           <div className="hidden md:flex items-center space-x-6">
            {/* Always visible links */}
            <Link
              href="/properties"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
            >
              Browse Properties
            </Link>

            {user && (
              <Link
                href="/bookmarks"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
              >
                Saved Properties
              </Link>
            )}

            {/* Role-based links */}
            {user?.role === 'agent' && (
              <>
                {/* <Link
                  href="/properties/create"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  Create Listing
                </Link> */}
                <Link
                  href="/realestate"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  Dashboard
                </Link>
              </>
            )}

            {user?.role === 'systemAdmin' && (
              <Link
                href="/admin"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
              >
                Admin Panel
              </Link>
            )}
          </div>

          {/* Right side - User menu and mobile button */}
          <div className="flex items-center gap-4">
            <div className="md:flex items-center mr-3 md:mr-10">
              <UserMenu />
            </div>
            
            {/* Mobile menu button */}
            {/* <div className="md:hidden">
              <MobileNav />
            </div> */}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}