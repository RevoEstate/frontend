"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-100">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        // whileHover={{ scale: 1.1 }}
        className="text-white font-bold text-4xl md:text-5xl text-center drop-shadow-lg"
      >
        Welcome to the Final Year Project 🚀
      </motion.h1>
    </div>
  );
}
