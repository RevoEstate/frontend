"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useSession } from "@/lib/auth-client";
import { BellIcon } from "lucide-react";
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
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RealestateForm } from "./RealestateForm";
import { ScrollArea } from "../ui/scroll-area";
import { useEffect, useState } from "react";

export function RealestateDashboardHeader() {
  const { data: session } = useSession();
  const [realestate, setRealestate] = useState(null);
  const user = session?.user;
  const userId = user?.id;
  const notificationCount = 5; // Replace with actual notification count
  const defaultProfileImage = "/default-realestate.jpg"; // Placeholder image path

  useEffect(() => {
    const getRealestate = () => {
      fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/companies/getCompanyByUserId/${userId}`,
        { credentials: "include", method: "GET" }
      )
        .then((response) => response.json())
        .then((data) => {
          setRealestate(data);
          console.log(data);
        })
        .catch((error) => {
          console.error("Error fetching real estate data:", error);
        });
    };
    if (userId) {
      getRealestate();
    }
  }, [userId]);

  const isVerified = realestate?.data?.isVerified || false;
  const realestateName = realestate?.data?.realEstateName;
  // const profileImage = realestate?.data?.imageUrl || defaultProfileImage;

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-15">
        {/* Show verification prompt if NOT verified */}
        {!isVerified ? (
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
          <>
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
                      {realestateName}
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
          </>
        )}
      </div>
    </header>
  );
}
