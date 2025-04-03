"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";

export default function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden bg-gray-100 border-gray-300 shadow-sm hover:bg-gray-100">
          <Menu className="h-5 w-5 text-sky-500" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-64">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-3 mt-6">
          <Link href="/buy">
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-100">
              Buy
            </Button>
          </Link>
          <Link href="/rent">
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-100">
              Rent
            </Button>
          </Link>
          <Link href="/sell">
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-100">
              Sell
            </Button>
          </Link>
          <Link href="/signup-customer" className="mt-4 px-3">
            <Button variant="outline" className="w-full font-medium bg-sky-500 hover:bg-sky-600 text-white">
              Sign In
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
