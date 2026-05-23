"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface StampRevealProps {
  children: ReactNode;
  delay?: number;
  rotate?: number;
  className?: string;
}

export function StampReveal({
  children,
  delay = 0,
  rotate = -7,
  className,
}: StampRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.6, rotate: rotate - 6 }}
      whileInView={{ opacity: 0.85, scale: 1, rotate }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
