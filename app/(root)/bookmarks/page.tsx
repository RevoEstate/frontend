import BookmarkList from '@/components/shared/BookMarkList'
import React from 'react'

const BookmarkPage = () => {
  return (
    <div className='mt-20 container py-5'>
        <h1 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-8">
        Your Favorite Properties
        </h1>
        <BookmarkList />
    </div>
  )
}

export default BookmarkPage
