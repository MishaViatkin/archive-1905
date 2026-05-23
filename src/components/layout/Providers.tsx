import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileNav } from "./MobileNav";
import { ScrollProgress } from "@/components/effects/ScrollProgress";
import { ScrollToTop } from "@/components/effects/ScrollToTop";
import { PageTransition } from "@/components/effects/PageTransition";
import { getSearchIndex } from "@/lib/content";

export function Providers({ children }: { children: ReactNode }) {
  const index = getSearchIndex();
  return (
    <>
      <ScrollProgress />
      <Header searchIndex={index} />
      <main className="flex-1 pb-16 lg:pb-0">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <MobileNav />
      <ScrollToTop />
    </>
  );
}
