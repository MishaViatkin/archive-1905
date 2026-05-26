"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { QuizQuestion } from "@/lib/types";

interface QuizGameProps {
  questions: QuizQuestion[];
}

type Stage = "intro" | "playing" | "done";

function shuffle<T>(arr: T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const LETTERS = ["А", "Б", "В", "Г", "Д", "Е"];

export function QuizGame({ questions }: QuizGameProps) {
  const [stage, setStage] = useState<Stage>("intro");
  const [deck, setDeck] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  // Bump on restart so React replays mount-time animations.
  const [restartKey, setRestartKey] = useState(0);

  const total = questions.length;
  const q = deck[current];

  const start = () => {
    setDeck(shuffle(questions));
    setCurrent(0);
    setScore(0);
    setPicked(null);
    setStage("playing");
    setRestartKey((k) => k + 1);
  };

  const pick = (idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
    if (idx === q.correct) setScore((s) => s + 1);
  };

  const next = () => {
    if (current < deck.length - 1) {
      setCurrent((c) => c + 1);
      setPicked(null);
    } else {
      setStage("done");
    }
  };

  const restart = () => {
    setStage("intro");
    setDeck([]);
    setCurrent(0);
    setScore(0);
    setPicked(null);
  };

  const progress = useMemo(() => {
    if (stage !== "playing" || deck.length === 0) return 0;
    return ((current + (picked !== null ? 1 : 0)) / deck.length) * 100;
  }, [stage, deck.length, current, picked]);

  if (stage === "intro") {
    return <Intro total={total} onStart={start} />;
  }

  if (stage === "done") {
    return (
      <Done score={score} total={deck.length} onRestart={restart} />
    );
  }

  return (
    <div className="mt-10">
      {/* Top progress */}
      <div className="mb-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-ink-faded">
        <span>
          Вопрос <span className="font-bold text-ink">{current + 1}</span> из{" "}
          <span className="font-bold text-ink">{deck.length}</span>
        </span>
        <span>
          Счёт <span className="font-bold text-accent">{score}</span> /{" "}
          {deck.length}
        </span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-ink/15">
        <motion.span
          className="block h-full bg-accent"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.article
          key={`${restartKey}-${current}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="doc-card mt-6 rounded-sm p-6 md:p-8"
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faded">
            Сцена {String(current + 1).padStart(2, "0")} · вопрос
          </p>
          <h2 className="mt-2 font-display text-2xl leading-snug text-ink md:text-3xl">
            {q.q}
          </h2>

          <ul className="mt-6 space-y-3">
            {q.options.map((opt, i) => {
              const isCorrect = picked !== null && i === q.correct;
              const isWrongPick =
                picked !== null && picked === i && i !== q.correct;
              return (
                <li key={i}>
                  <button
                    type="button"
                    disabled={picked !== null}
                    onClick={() => pick(i)}
                    className={`group flex w-full items-start gap-3 rounded-sm border px-4 py-3 text-left transition ${
                      picked === null
                        ? "border-ink/25 bg-paper/80 hover:border-accent hover:bg-accent/5"
                        : isCorrect
                          ? "border-green-700/40 bg-green-50/60"
                          : isWrongPick
                            ? "border-accent/60 bg-accent/5"
                            : "border-ink/15 bg-paper/40 opacity-70"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border font-display text-[11px] font-bold ${
                        isCorrect
                          ? "border-green-700 bg-green-700 text-paper"
                          : isWrongPick
                            ? "border-accent bg-accent text-paper"
                            : "border-ink/30 text-ink-faded group-hover:border-accent group-hover:text-accent"
                      }`}
                    >
                      {LETTERS[i]}
                    </span>
                    <span className="font-serif text-sm leading-relaxed text-ink md:text-base">
                      {opt}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <AnimatePresence>
            {picked !== null && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-6 rounded-sm border-l-4 border-accent bg-paper/60 p-4"
              >
                <p
                  className={`font-display text-sm uppercase tracking-widest ${
                    picked === q.correct ? "text-green-700" : "text-accent"
                  }`}
                >
                  {picked === q.correct ? "Верно" : "Не угадали"}
                  <span className="ml-2 text-ink-faded">
                    · правильный ответ — {LETTERS[q.correct]}
                  </span>
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink/90">
                  {q.fact}
                </p>
                <p className="mt-3 border-t border-dashed border-ink/30 pt-2 font-mono text-[10px] uppercase tracking-widest text-ink-faded">
                  Источник: {q.source}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {picked !== null && (
            <div className="mt-6 flex items-center justify-end">
              <button
                type="button"
                onClick={next}
                className="rounded border border-accent bg-accent px-5 py-2 text-xs uppercase tracking-widest text-paper hover:bg-accent/85"
              >
                {current < deck.length - 1
                  ? "Дальше →"
                  : "Итоговый счёт ↦"}
              </button>
            </div>
          )}
        </motion.article>
      </AnimatePresence>
    </div>
  );
}

function Intro({ total, onStart }: { total: number; onStart: () => void }) {
  return (
    <div className="mt-10">
      <div className="doc-card rounded-sm p-6 md:p-10">
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faded">
          {total} вопросов · 4 варианта · 1 верный
        </p>
        <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">
          Проверьте свои знания о революции 1905–1907 годов в Екатеринбурге
        </h2>
        <p className="mt-4 leading-relaxed text-ink/85">
          После каждого вопроса появится небольшая историческая справка с
          цитатой из опубликованного источника. Порядок вопросов перемешивается
          при каждом запуске.
        </p>

        <ul className="mt-6 grid gap-3 text-sm text-ink/80 md:grid-cols-2">
          <li className="flex gap-2">
            <span className="text-accent">✶</span>
            Условия труда и кризис 1900–1904 годов
          </li>
          <li className="flex gap-2">
            <span className="text-accent">✶</span>
            Стачка ВИЗ и пять требований
          </li>
          <li className="flex gap-2">
            <span className="text-accent">✶</span>
            «Окно легальности» и митинги
          </li>
          <li className="flex gap-2">
            <span className="text-accent">✶</span>
            Совет рабочих депутатов · 16 ноября
          </li>
          <li className="flex gap-2">
            <span className="text-accent">✶</span>
            Боевые дружины: большевики vs эсеры
          </li>
          <li className="flex gap-2">
            <span className="text-accent">✶</span>
            От 1905-го к Свердловску
          </li>
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onStart}
            className="rounded border border-accent bg-accent px-6 py-2.5 text-sm uppercase tracking-widest text-paper hover:bg-accent/85"
          >
            ▶ Начать квиз
          </button>
          <Link
            href={"/chronicle" as never}
            className="rounded border border-ink/30 px-6 py-2.5 text-sm uppercase tracking-widest text-ink/70 hover:border-accent hover:text-accent"
          >
            Сначала к хронике
          </Link>
        </div>
      </div>
    </div>
  );
}

function Done({
  score,
  total,
  onRestart,
}: {
  score: number;
  total: number;
  onRestart: () => void;
}) {
  const percent = Math.round((score / total) * 100);
  const verdict =
    score === total
      ? "Превосходно! Вы знаете работу до запятой."
      : score >= Math.ceil(total * 0.7)
        ? "Хороший результат — основной нарратив вы освоили."
        : score >= Math.ceil(total * 0.4)
          ? "Неплохо. Самое время вернуться к хронике и атласу."
          : "Стоит повторить материал — начните со словаря и источниковой базы.";

  return (
    <div className="mt-10">
      <div className="doc-card rounded-sm p-6 text-center md:p-10">
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faded">
          Итог
        </p>
        <p className="mt-2 font-display text-7xl font-bold text-accent">
          {score}
          <span className="text-ink-faded/70">/{total}</span>
        </p>
        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-ink-faded">
          {percent}% правильных ответов
        </p>
        <h2 className="mx-auto mt-6 max-w-2xl font-display text-2xl text-ink">
          {verdict}
        </h2>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onRestart}
            className="rounded border border-accent bg-accent px-5 py-2 text-xs uppercase tracking-widest text-paper hover:bg-accent/85"
          >
            ↻ Пройти ещё раз
          </button>
          <Link
            href={"/sources" as never}
            className="rounded border border-ink/30 px-5 py-2 text-xs uppercase tracking-widest text-ink/70 hover:border-accent hover:text-accent"
          >
            К картотеке
          </Link>
          <Link
            href={"/glossary" as never}
            className="rounded border border-ink/30 px-5 py-2 text-xs uppercase tracking-widest text-ink/70 hover:border-accent hover:text-accent"
          >
            К словарю
          </Link>
        </div>
      </div>
    </div>
  );
}
