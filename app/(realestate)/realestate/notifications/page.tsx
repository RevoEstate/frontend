import NotificationList from '@/components/realestate/NotificationList';
import React from 'react';

const NotificationsPage = () => {
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
      </div>
      <NotificationList />
    </div>
  );
};

export default NotificationsPage;