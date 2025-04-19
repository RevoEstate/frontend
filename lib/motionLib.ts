import { Variants } from "framer-motion";

export const motionTextProps: Variants = {
  initial: { opacity: 0, y: 20 },
  whileInView: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "tween",
      ease: [0.42, 0, 0.58, 1],
      delay: 0.2,
      duration: 0.6,
    }
  }
};

export const motionImageProps: Variants = {
  initial: { opacity: 0, scale: 0.85 },
  whileInView: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "tween",
      ease: [0.42, 0, 0.58, 1],
      delay: 0.1,
      duration: 0.6,
    }
  }
};