"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, Sphere, OrbitControls, useTexture } from "@react-three/drei";
import Image from "next/image";
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Expand, Shrink } from "lucide-react";
import { Button } from "../ui/button";
import { Loader } from "./Loader";

type PanoramaProps = {
  panoramicImages: string[]; // Array of image paths
};

export default function Panorama({ panoramicImages }: PanoramaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitControlsRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % panoramicImages.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + panoramicImages.length) % panoramicImages.length);
  };

  useEffect(() => {
    const handleClick = () => {
      if (orbitControlsRef.current) {
        setIsAutoRotate(false);
      }
      setTimeout(() => {
        if (orbitControlsRef.current) {
          setIsAutoRotate(true);
        }
      }, 5000);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("click", handleClick);
    }

    return () => {
      if (container) {
        container.removeEventListener("click", handleClick);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className='c-space'
    >
      <motion.div
        className={`transition-all duration-500 ease-in-out ${isExpanded
          ? "fixed inset-0 z-50 w-screen h-screen"
          : "relative mx-auto w-full h-[500px] md:h-[500px]"
          } flex items-center justify-center`}
      >
        <Canvas className="w-full h-full">
          <PerspectiveCamera makeDefault fov={75} position={[0, 0, 5]} />

          <OrbitControls
            ref={orbitControlsRef}
            enableZoom
            zoomSpeed={0.8}
            minDistance={1}
            maxDistance={2}
            enablePan={true}
            autoRotate={isAutoRotate}
            autoRotateSpeed={0.5}
            enableDamping
            dampingFactor={0.06}
          />

          <Suspense fallback={<Loader />}>
            <PanoramaSphere panoramicImage={panoramicImages[currentImageIndex]} />
          </Suspense>
        </Canvas>

        {/* Expand/Collapse Button */}
        <div className="absolute top-[3%] right-[3%] z-10">
          <Button
            variant='default'
            onClick={() => setIsExpanded((prev) => !prev)}
            className="cursor-pointer bg-white/20 hover:bg-white/30 p-3 rounded-full transition"
          >
            {isExpanded ? (
              <Shrink size={32} color="#ffffff" strokeWidth={3} />
            ) : (
              <Expand size={32} color="#ffffff" strokeWidth={3} />
            )}
          </Button>
        </div>

        {/* Left and Right Arrows */}
        <div className="absolute top-[49%] left-[3%] z-10">
          <Button
            variant='outline'
            onClick={handlePrev}
            className="cursor-pointer bg-white/40 hover:bg-white/50 w-12 h-12 flex items-center justify-center rounded-full  transition"
          >
            <ChevronLeft size={32} color="#ffffff" strokeWidth={3} />
          </Button>
        </div>
        <div className="absolute top-[49%] right-[3%] z-10">
          <Button
            variant='outline'
            onClick={handleNext}
            className="cursor-pointer bg-white/40 hover:bg-white/50 w-12 h-12 flex items-center justify-center rounded-full transition"
          >
            <ChevronRight size={32} color="#ffffff" strokeWidth={3} />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

function PanoramaSphere({ panoramicImage }: { panoramicImage: string }) {
  const texture = useTexture(panoramicImage);

  if (!texture) {
    console.error("Texture not loaded");
    return null;
  }

  return (
    <Sphere args={[15, 60, 40]} scale={[-1, 1, 1]}>
      <meshBasicMaterial map={texture} side={2} />
    </Sphere>
  );
}
