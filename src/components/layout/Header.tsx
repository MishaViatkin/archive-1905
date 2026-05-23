"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/lib/navigation";
import { SearchPalette } from "@/components/search/SearchPalette";
import type { SearchItem } from "@/lib/types";

export function Header({ searchIndex }: { searchIndex: SearchItem[] }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b-4 border-double border-ink/80 bg-paper/95 backdrop-blur print:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3">
        <Link href="/" className="group flex items-baseline gap-3">
          <span className="font-display text-2xl font-bold tracking-tight text-ink group-hover:text-accent">
            АРХИВ 1905
          </span>
          <span className="hidden text-xs uppercase tracking-[0.2em] text-ink-faded lg:inline">
            · Екатеринбургское отделение
          </span>
        </Link>

        <nav className="hidden gap-1 lg:flex">
          {mainNav.slice(0, 6).map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative px-2.5 py-1 text-sm transition ${
                  active ? "text-accent" : "text-ink/70 hover:text-ink"
                }`}
              >
                <span className="font-display text-xs tracking-[0.2em] opacity-60">
                  {item.number}
                </span>
                <span className="ml-1.5 font-display tracking-wide">
                  {item.label}
                </span>
                {active && (
                  <span className="absolute inset-x-0 -bottom-1 h-px bg-accent" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <SearchPalette index={searchIndex} />
        </div>
      </div>

      <div className="lg:hidden">
        <nav className="flex overflow-x-auto border-t border-ink/20 px-4 py-2 text-xs">
          {mainNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap px-3 py-1 ${
                  active ? "text-accent" : "text-ink/70"
                }`}
              >
                {item.number} · {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
