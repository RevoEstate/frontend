"use client"

import { useBookmarks } from '@/hooks/useBookmark';
import { PropertyCard } from './PropertyCard';
import { useEffect, useState } from 'react';

const BookmarkList = () => {
  const { data: initialBookmarks, isLoading, error } = useBookmarks();
  const [bookmarks, setBookmarks] = useState(initialBookmarks || []);

  // Update local state when initial bookmarks load
  useEffect(() => {
    if (initialBookmarks) {
      setBookmarks(initialBookmarks);
    }
  }, [initialBookmarks]);

  const handleRemoveBookmark = (bookmarkId: string) => {
    setBookmarks(prev => prev.filter(b => b._id !== bookmarkId));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div>Loading bookmarks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Error loading bookmarks: {error.message}
      </div>
    );
  }

  if (!bookmarks || bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4 border-1 mx-auto md:w-[50vw] shadow-sm">
        <div className="text-gray-500">You haven't bookmarked any properties yet</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookmarks.map((bookmark) => (
        <PropertyCard
          key={bookmark._id}
          property={bookmark.propertyId}
          onRemoveBookmark={() => handleRemoveBookmark(bookmark._id)}
        />
      ))}
    </div>
  );
};

export default BookmarkList;