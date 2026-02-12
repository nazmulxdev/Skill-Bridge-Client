"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function AnimatedGradient() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />

      {/* Animated orbs that follow mouse */}
      <motion.div
        className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl"
        animate={{
          x: mousePosition.x * 0.5,
          y: mousePosition.y * 0.5,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 30 }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-success/10 blur-3xl"
        animate={{
          x: -mousePosition.x * 0.3,
          y: -mousePosition.y * 0.3,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 30 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-warning/5 blur-3xl"
        animate={{
          x: mousePosition.x * 0.2,
          y: mousePosition.y * 0.2,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 30 }}
      />
    </>
  );
}
