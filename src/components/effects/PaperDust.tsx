"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export function PaperDust({ count = 30 }: { count?: number }) {
  // Particles are generated client-side only — Math.random is impure for
  // render, so we keep it inside useEffect.
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const next: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      duration: 12 + Math.random() * 18,
      delay: Math.random() * 8,
      opacity: 0.15 + Math.random() * 0.3,
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(next);
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-ink-faded"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [-20, 20, -10, 15, -20],
            x: [-15, 10, -8, 20, -15],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
