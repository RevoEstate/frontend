"use client";

import { Html, useProgress } from "@react-three/drei";
import { motion } from "framer-motion";

export function Loader() {
  const { progress } = useProgress();
  
  return (
    <Html center>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center gap-4 p-8 bg-white rounded-lg"
      >
        {/* Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-t-sky-500 border-r-transparent border-b-transparent border-l-transparent rounded-full"
        />
        
        {/* Progress text */}
        <p className="text-sky-600 font-medium">
            {Math.round(progress)}%
        </p>
        
        {/* Progress bar */}
        <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-blue-500"
          />
        </div>
      </motion.div>
    </Html>
  );
}

