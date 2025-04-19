"use client";

import { motion, useAnimation, useScroll } from "framer-motion";
import { FiArrowUp } from "react-icons/fi";
import { useEffect, useState } from "react";

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const controls = useAnimation();
  const { scrollY } = useScroll();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    const updateVisibility = (y: number) => {
      const shouldBeVisible = y > 300; // Show after 300px scroll
      setIsVisible(shouldBeVisible);
      
      if (shouldBeVisible) {
        controls.start("visible");
      } else {
        controls.start("hidden");
      }
    };

    // Update immediately with current scroll position
    updateVisibility(scrollY.get());

    // Subscribe to scroll changes
    const unsubscribe = scrollY.on("change", updateVisibility);

    return () => unsubscribe();
  }, [controls, scrollY]);

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="cursor-pointer fixed bottom-6 right-6 z-50 p-3 bg-sky-600/60 hover:bg-sky-600/90 backdrop-blur-sm rounded-full shadow-lg transition-all"
      whileHover={{ scale: 1.1, y: -5 }}
      whileTap={{ scale: 0.95 }}
      initial="hidden"
      animate={controls}
      variants={variants}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <FiArrowUp className="text-white text-xl" />
    </motion.button>
  );
};

export default BackToTopButton;