"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { mainNav } from "@/lib/navigation";

const STORAGE_KEY = "archive-1905:visited";

function readVisited(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

function writeVisited(set: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch {
    // ignore
  }
}

export function ReadProgress() {
  const pathname = usePathname();
  // Lazy init reads from localStorage without an effect — no cascading renders.
  const [visited, setVisited] = useState<Set<string>>(() => readVisited());

  useEffect(() => {
    if (!pathname || pathname === "/") return;
    // setVisited inside an effect is fine here: it runs once per route change
    // and is idempotent (early return when the path is already known).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisited((prev) => {
      if (prev.has(pathname)) return prev;
      const next = new Set(prev);
      next.add(pathname);
      writeVisited(next);
      return next;
    });
  }, [pathname]);

  const total = mainNav.length;
  const done = mainNav.filter((n) => visited.has(n.href)).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-ink-faded">
      <span className="font-mono">прочитано · {done}/{total}</span>
      <span
        className="relative h-1 w-16 overflow-hidden rounded-full bg-ink/15"
        aria-label={`Прогресс ${percent}%`}
      >
        <span
          className="absolute inset-y-0 left-0 bg-accent transition-[width] duration-500"
          style={{ width: `${percent}%` }}
        />
      </span>
    </div>
  );
}
