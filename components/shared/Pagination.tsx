import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pagesToShow?: number; // Number of page buttons to display
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pagesToShow = 5,
}) => {
  const [displayedPages, setDisplayedPages] = useState<number[]>([]);

  // Calculate which pages to display
  useEffect(() => {
    const halfPagesToShow = Math.floor(pagesToShow / 2);
    let startPage = Math.max(1, currentPage - halfPagesToShow);
    let endPage = Math.min(totalPages, startPage + pagesToShow - 1);

    // Adjust startPage if endPage is at totalPages
    if (endPage - startPage + 1 < pagesToShow) {
      startPage = Math.max(1, endPage - pagesToShow + 1);
    }

    const pages = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
    setDisplayedPages(pages);
  }, [currentPage, totalPages, pagesToShow]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 my-4">
      {/* Previous Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`px-3 py-1 rounded-full text-white bg-sky-500 hover:bg-sky-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer ${
          currentPage === 1 ? 'opacity-50' : ''
        }`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        &larr;
      </motion.button>

      {/* Page Numbers */}
      <AnimatePresence mode="popLayout">
        {displayedPages.map((page) => (
          <motion.button
            key={page}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1 rounded-full transition-colors duration-200 cursor-pointer ${
              currentPage === page
                ? 'bg-sky-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => handlePageChange(page)}
            aria-label={`Page ${page}`}
          >
            {page}
          </motion.button>
        ))}
      </AnimatePresence>

      {/* Next Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`px-3 py-1 rounded-full text-white bg-sky-500 hover:bg-sky-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer ${
          currentPage === totalPages ? 'opacity-50' : ''
        }`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        &rarr;
      </motion.button>
    </div>
  );
};

export default Pagination;