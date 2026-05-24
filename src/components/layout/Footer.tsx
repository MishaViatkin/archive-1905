import Link from "next/link";
import { mainNav } from "@/lib/navigation";
import { ReadProgress } from "@/components/effects/ReadProgress";
import { ShareLink } from "@/components/effects/ShareLink";

export function Footer() {
  return (
    <footer className="mt-16 border-t-2 border-ink/40 bg-paper/60 print:hidden">
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-ink-faded">
        <div className="grid gap-8 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <p className="font-display text-base text-ink">АРХИВ 1905</p>
            <p className="mt-2 text-xs leading-relaxed">
              Цифровое расследование по аналитической работе УрФУ, кафедра
              отечественной истории. Все цифры сопровождаются ссылкой на
              источник; лакуны не скрываются. Третья редакция, расширенная.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <ShareLink />
              <span className="font-mono text-[10px] uppercase tracking-widest">
                <kbd className="rounded border border-ink/30 bg-paper px-1.5 py-0.5">⌘K</kbd>{" "}
                · поиск
              </span>
              <ReadProgress />
            </div>
          </div>
          <div className="text-xs">
            <p className="font-display text-ink">Разделы</p>
            <ul className="mt-2 space-y-1">
              {mainNav.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href as never}
                    className="hover:text-accent"
                  >
                    {n.number} · {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-xs">
            <p className="font-display text-ink">Архивные фонды</p>
            <ul className="mt-2 space-y-1">
              <li>ГАСО · ф. 11, 185</li>
              <li>ГАПК · ф. 65</li>
              <li>ЦДООСО · ф. 41</li>
            </ul>
            <p className="mt-3 font-display text-ink">Печать</p>
            <p className="mt-1">
              13 источников · 15 фигурантов
              <br />
              13 событий · 7 лакун · 20 терминов
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
