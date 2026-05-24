"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/lib/navigation";

const SHORT: Record<string, string> = {
  "/chronicle": "Хроника",
  "/atlas": "Атлас",
  "/network": "Сеть",
  "/dossier": "Досье",
  "/source-base": "База",
  "/legacy": "Наследие",
  "/glossary": "Словарь",
  "/sources": "Карт.",
};

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-double border-ink/40 bg-paper/95 backdrop-blur lg:hidden print:hidden">
      <ul className="mx-auto flex max-w-7xl items-stretch overflow-x-auto">
        <li className="flex-shrink-0">
          <Link
            href={"/" as never}
            className={`flex h-14 min-w-[60px] flex-col items-center justify-center px-3 text-[10px] uppercase tracking-widest ${
              pathname === "/" ? "text-accent" : "text-ink/70"
            }`}
          >
            <span className="font-display text-base">⌂</span>
            <span>Главная</span>
          </Link>
        </li>
        {mainNav.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href} className="flex-shrink-0">
              <Link
                href={item.href as never}
                className={`flex h-14 min-w-[60px] flex-col items-center justify-center px-3 text-[10px] uppercase tracking-widest ${
                  active ? "text-accent" : "text-ink/70"
                }`}
              >
                <span className="font-display text-xs opacity-60">
                  {item.number}
                </span>
                <span>{SHORT[item.href] ?? item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
