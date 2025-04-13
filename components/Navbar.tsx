"use client";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import MobileNav from "./MobileNav";
import Link from "next/link";
import { NAV_ITEMS } from "../lib/constants";
//
export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  // Hide navbar on scroll down, show on scroll up
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
      className="fixed top-0 w-full bg-white/20 dark:bg-gray-900/80 z-50 backdrop-blur-md"
    >
      <div className="container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-3xl font-extrabold text-black">RevoEstate</h1>
          </div>

          <div className="flex justify-start items-center gap-5">
            {/* Nav Items (Center - Desktop) */}
            <div className="hidden md:flex gap-3 px-8">
              {NAV_ITEMS.map((item) => (
                <Link
                  className="bg-transparent py-1 px-5 text-lg font-bold hover:font-semibold hover:bg-white/30 hover:rounded-md text-gray-500 hover:text-gray-700"
                  key={item.href}
                  href={item.href}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Sign In */}
            <div className="flex items-center gap-4">
              <Link href="/sign-in">
                <Button
                  variant="outline"
                  className="hidden md:block px-8 cursor-pointer bg-sky-500 hover:bg-sky-600 text-white hover:text-white"
                >
                  Sign In
                </Button>
                <MobileNav /> {/* Mobile Sheet Toggle */}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
