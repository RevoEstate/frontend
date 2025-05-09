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
import { useRouter } from "next/navigation";
import { IssueReport } from "./IssueReport";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import axiosInstance from '@/lib/axiosInstance';

interface Notification {
  _id: string;
  receiverIds: string[];
  text: string;
  from: string;
  readBy: string[];
  // Add other fields as needed
}

export function RealestateDashboardHeader({ realestate, error, isLoading }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [notificationError, setNotificationError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        setLoadingNotifications(true);
        const response = await axiosInstance.get(
          `/v1/notification/not-viewed/${userId}`,
          { withCredentials: true }
        );
        
        if (response.data.success && response.data.data) {
          setNotifications(response?.data?.data);
          console.log("Notifications: ", response.data.data)
        }
      } catch (err) {
        setNotificationError(err instanceof Error ? err.message : 'Failed to fetch notifications');
        console.error("Notification fetch error:", err);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();

    // Set up polling every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  // Calculate unread count
  const unreadCount = notifications.filter(notification => 
    !notification.readBy.includes(userId)
  ).length;

  return (
    <header className="flex items-center justify-between">
      {/* Issue Section */}
      <div>
        <IssueReport />
      </div>

      <div className="flex items-center gap-15">
        {/* Show verification prompt if NOT verified */}
        {realestate?.verificationStatus === "initial" ? (
          <Button className="bg-sky-500 hover:bg-sky-600">
            Verification Status: Pending
          </Button>
        ) : (
          <div>
            {!realestate?.isVerified ? (
              <>
                <Button
                  onClick={() => router.push("/realestate/profile/create")}
                  variant="ghost"
                  size="sm"
                  className="bg-sky-600 hover:bg-sky-600/80 text-white hover:text-white cursor-pointer"
                >
                  Verify account
                </Button>
              </>
            ) : (
              /* Show notifications with real data */
              <div className="flex justify-center items-center gap-8">
                <Button
                  onClick={() => router.push('/realestate/notifications')}
                  variant="ghost"
                  size="icon"
                  className="relative cursor-pointer rounded-full h-10 w-10"
                  disabled={loadingNotifications}
                >
                  {loadingNotifications ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <BellIcon size={24} className="text-foreground" />
                      {unreadCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                        >
                          {unreadCount}
                        </Badge>
                      )}
                    </>
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