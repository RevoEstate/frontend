"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-8">
          <Button variant="ghost" className="w-full justify-start">
            Buy
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Rent
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Sell
          </Button>
          <Button variant="outline" className="w-full mt-4">
            Sign In
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}