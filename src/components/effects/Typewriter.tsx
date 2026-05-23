"use client";

import { useEffect, useState } from "react";

interface TypewriterProps {
  text: string;
  speed?: number;
  startDelay?: number;
  className?: string;
  showCaret?: boolean;
  onDone?: () => void;
}

export function Typewriter({
  text,
  speed = 40,
  startDelay = 0,
  className,
  showCaret = true,
  onDone,
}: TypewriterProps) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let active = true;
    let idx = 0;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    // Reset state for a fresh typing run.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShown("");
    setDone(false);

    const tick = () => {
      if (!active) return;
      idx += 1;
      setShown(text.slice(0, idx));
      if (idx >= text.length) {
        setDone(true);
        onDone?.();
        return;
      }
      timeoutId = setTimeout(tick, speed);
    };

    const startId = setTimeout(tick, startDelay);

    return () => {
      active = false;
      if (timeoutId) clearTimeout(timeoutId);
      clearTimeout(startId);
    };
  }, [text, speed, startDelay, onDone]);

  return (
    <span className={`${className ?? ""} ${showCaret && !done ? "caret" : ""}`}>
      {shown}
    </span>
  );
}
