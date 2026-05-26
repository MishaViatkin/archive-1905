import { QuizGame } from "@/components/quiz/QuizGame";
import quiz from "@/content/data/quiz.json";
import type { QuizQuestion } from "@/lib/types";

export const metadata = {
  title: "Квиз",
  description:
    "Интерактивный квиз по аналитической работе УрФУ: 10 вопросов о революции 1905–1907 годов в Екатеринбурге, со справкой к каждому ответу.",
};

export default function QuizPage() {
  const questions = quiz as QuizQuestion[];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="rule-thick-thin pt-3">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-ink-faded">
          Раздел IX · Аттестация
        </p>
        <h1 className="mt-1 font-display text-5xl text-ink md:text-6xl">
          Квиз
        </h1>
        <p className="mt-3 max-w-2xl text-ink-faded">
          {questions.length} вопросов из материалов работы. После каждого ответа
          — историческая справка с указанием источника. Можно проходить много
          раз: порядок вопросов меняется.
        </p>
      </header>

      <QuizGame questions={questions} />
    </div>
  );
}
