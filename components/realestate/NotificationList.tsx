"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  AlertTriangle, 
  Mail, 
  RefreshCw, 
  Check, 
  Info, 
  Bell, 
  BellOff,
  AlertCircle, 
  Delete,
  Trash2
} from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '../ui/button';

interface Notification {
  _id: string;
  receiverIds: string[];
  text: string;
  from: string;
  readBy: string[];
  viewedBy: string[];
  createdAt: string;
}

interface ApiResponse {
  statusCode: number;
  data: Notification[];
  message: string;
  success: boolean;
}

const NotificationList = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse>(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/notification/user/${userId}`, 
          { withCredentials: true }
        );
        
        if (response.data.success && Array.isArray(response.data.data)) {
          setNotifications(response.data.data);
        }
        setLoading(false);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to fetch notifications');
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  const handleNotificationClick = async (notificationId: string) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/notification/markAsRead`,
        { notificationId },
        { withCredentials: true }
      );
      
      setNotifications(prev => prev.map(n => 
        n._id === notificationId 
          ? { ...n, readBy: [...n.readBy, userId] } 
          : n
      ));

      console.log("Opening notification:", notificationId);
      // router.push(`/notification/${notificationId}`);

    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const getNotificationIcon = (from: string) => {
    const iconClass = 'h-4 w-4';
    switch (from.toLowerCase()) {
      case 'alert': return <AlertTriangle className={`${iconClass} text-yellow-500`} />;
      case 'message': return <Mail className={`${iconClass} text-blue-500`} />;
      case 'update': return <RefreshCw className={`${iconClass} text-purple-500`} />;
      case 'success': return <Check className={`${iconClass} text-green-500`} />;
      case 'system': return <Info className={`${iconClass} text-gray-500`} />;
      default: return <Bell className={`${iconClass} text-gray-500`} />;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!userId) {
    return (
      <div className="bg-destructive/10 border-destructive p-4 rounded-md">
        <div className="flex items-center space-x-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <p>Error: User not authenticated</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4">
            <Skeleton className="h-4 w-4 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border-destructive p-4 rounded-md">
        <div className="flex items-center space-x-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <BellOff className="h-10 w-10 text-gray-400 mb-4" />
        <p className="text-gray-500">No notifications found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]"></TableHead>
          <TableHead>Message</TableHead>
          <TableHead className="text-right">Time</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {notifications.map((notification) => {
          const isRead = notification.readBy.includes(userId);
          return (
            <TableRow 
              key={notification._id}
              className={`cursor-pointer ${!isRead ? 'bg-accent/50' : ''}`}
              onClick={() => handleNotificationClick(notification._id)}
            >
              <TableCell className="w-[50px]">
                <div className="flex items-center justify-center">
                  {getNotificationIcon(notification.from)}
                  {!isRead && (
                    <span className="ml-2">
                      <Badge variant="secondary" className="h-2 w-2 p-0 rounded-full" />
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <div className={`font-medium ${!isRead ? 'font-semibold' : ''}`}>
                    {notification.from}
                  </div>
                    <div className={`text-sm ${!isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {notification.text.length > 100 
                    ? `${notification.text.substring(0, 100)}...` 
                    : notification.text}
                    </div>
                </div>
              </TableCell>
              <TableCell className="text-right text-muted-foreground text-sm">
                {formatTime(notification.createdAt)}
              </TableCell>
              <TableCell className="text-right text-muted-foreground text-sm">
                <Button
                    className='cursor-pointer p-3 font-bold rounded-full text-red-600 hover:bg-red-100 hover:text-red-800'
                    variant='ghost'
                    onClick={() => {}}
                    >
                    <Trash2 />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default NotificationList;