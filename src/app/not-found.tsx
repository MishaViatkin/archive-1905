import Link from "next/link";
import { Stamp } from "@/components/ui/Stamp";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink-faded">
        Дело № 404
      </p>
      <h1 className="mt-2 font-display text-7xl font-bold text-ink md:text-8xl">
        Документ не найден
      </h1>
      <p className="mt-4 text-ink-faded">
        В фондах ГАСО, ГАПК и ЦДООСО запрошенная страница отсутствует. Это —
        ещё одна белая лакуна. Используйте картотечный поиск (⌘K) или
        вернитесь в основной архив.
      </p>

      <div className="my-10 flex items-center justify-center">
        <div className="doc-card relative inline-block rounded-sm px-10 py-12">
          <Stamp variant="lacuna" rotate={-12} className="absolute -top-4 -right-4">
            УТРАЧЕНО
          </Stamp>
          <p className="font-mono text-xs uppercase tracking-widest text-ink-faded">
            Архивный шифр
          </p>
          <p className="mt-1 font-display text-2xl text-ink">⁄ ⁄ ⁄ — — —</p>
          <p className="mt-3 max-w-xs text-xs italic text-ink/70">
            «Дело передано на утилизацию по описи 1937 г. Местонахождение
            неизвестно.»
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={"/" as never}
          className="rounded border border-accent bg-accent px-4 py-2 text-sm uppercase tracking-widest text-paper hover:bg-accent/85"
        >
          ⌂ На главную
        </Link>
        <Link
          href={"/sources" as never}
          className="rounded border border-ink/30 px-4 py-2 text-sm uppercase tracking-widest text-ink/70 hover:bg-ink/5"
        >
          В картотеку
        </Link>
        <Link
          href={"/lacunae" as never}
          className="rounded border border-ink/30 px-4 py-2 text-sm uppercase tracking-widest text-ink/70 hover:bg-ink/5"
        >
          К лакунам
        </Link>
      </div>
    </div>
  );
}
