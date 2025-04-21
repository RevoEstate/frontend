"use client"

import Link from "next/link";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useSession } from "@/lib/auth-client";
import { BellIcon, CircleCheckBig } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RealestateForm } from "./RealestateForm";
import { ScrollArea } from "../ui/scroll-area";

export function RealestateDashboardHeader() {
  const { data: session } = useSession();
  const user = session?.user;
  const notificationCount = 5; // Replace with actual notification count
  
  const isVerified = user?.realestate?.isVerified || false; // Default to false if undefined
  const realestateName = user?.realestate?.realEstateName || "Ovid Realestate";

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Show verification prompt if NOT verified */}
        {!isVerified ? (
          <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="bg-sky-600 hover:bg-sky-600/80 text-white hover:text-white cursor-pointer">
              Verify account
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-hidden w-[80vw]">
            <DialogHeader className="border-b p-3 mt-3">
              <DialogTitle className="text-center">Create Your Realestate Profile</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[70vh]">
              <RealestateForm type='Create' />
            </ScrollArea>
          </DialogContent>
        </Dialog>
        ) : (
          /* Show notifications and profile when verified */
          <>
            <Button variant="ghost" size="icon" className="relative cursor-pointer rounded-full h-10 w-10">
              <BellIcon size={24} className="text-foreground" />
              {notificationCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                >
                  {notificationCount}
                </Badge>
              )}
            </Button>

            <TooltipProvider>
              <Tooltip>   
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="bg-sky-100/50 hover:bg-sky-100/70 py-5">
                    <Link href="/realestate/profile" className="text-sm font-medium">
                      {realestateName}
                    </Link>
                    <CircleCheckBig size={48} color="#00faf6" strokeWidth={3} />
                  </Button> 
                </TooltipTrigger>  
                <TooltipContent className="font-semibold">
                  Account Verified
                </TooltipContent>    
              </Tooltip>      
            </TooltipProvider>
          </>
        )}
      </div>
    </header>
  );
}