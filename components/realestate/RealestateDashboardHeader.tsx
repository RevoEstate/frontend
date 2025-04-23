"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { BellIcon, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RealestateForm } from "./RealestateForm";
import { ScrollArea } from "../ui/scroll-area";
import { useRealestateByUserId } from "@/hooks/useRealestateByUser";
import { Alert, AlertDescription } from "../ui/alert";

export function RealestateDashboardHeader({realestate, error, isLoading}) {
  
  const notificationCount = 5; 

  // if (isLoading) {
  //   return (
  //     <header className="flex items-center justify-between">
  //       <div className="flex items-center gap-4">
  //         <Button
  //           variant="ghost"
  //           size="sm"
  //           className="bg-gray-100 hover:bg-gray-100 cursor-wait"
  //           disabled
  //         >
  //           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  //           Loading...
  //         </Button>
  //       </div>
  //     </header>
  //   );
  // }

  // if (error) {
  //   return (
  //     <header className="flex items-center justify-between">
  //       <Alert variant="destructive" className="w-auto">
  //         <AlertDescription className="flex items-center gap-2">
  //           <Loader2 className="h-4 w-4 animate-spin" />
  //           Failed to load profile: {error.message}
  //         </AlertDescription>
  //       </Alert>
  //     </header>
  //   );
  // }


  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-15">
        {/* Show verification prompt if NOT verified */}

        { realestate?.verificationStatus === 'initial' ? (
          <Button className="bg-sky-500 hover:bg-sky-600">
            Verification Status: Pending
          </Button>
        ) : (
          <div>   
            {!realestate?.isVerified ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-sky-600 hover:bg-sky-600/80 text-white hover:text-white cursor-pointer"
                >
                  Verify account
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-hidden w-[80vw]">
                <DialogHeader className="border-b p-3 mt-3">
                  <DialogTitle className="text-center">
                    Create Your Realestate Profile
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[70vh]">
                  <RealestateForm type="Create" />
                </ScrollArea>
              </DialogContent>
            </Dialog>
          ) : (
            /* Show notifications and profile when verified */
            <div className="flex justify-center items-center gap-8">
              <Button
                variant="ghost"
                size="icon"
                className="relative cursor-pointer rounded-full h-10 w-10"
              >
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
                    <Button
                      variant="ghost"
                      size="lg"
                      className="flex items-center gap-3 bg-sky-100/50 hover:bg-sky-100/70 py-2 px-3 rounded-lg relative"
                    >   
                      {/* Real Estate Name */}
                      <Link
                        href="/realestate/profile"
                        className="text-lg font-medium"
                      >
                        {realestate?.realEstateName}
                      </Link>
                      <div className="">                
                        <div className="bg-green-500 rounded-full p-0.5">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9.00002 16.2L4.80002 12L3.40002 13.4L9.00002 19L21 7.00002L19.6 5.60002L9.00002 16.2Z"
                              fill="white"
                            />
                          </svg>
                        </div>
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="font-semibold">
                    Account Verified
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          </div>
        )}

     
      </div>
    </header>
  );
}
