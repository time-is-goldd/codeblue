import "server-only";

import type { Faq, FaqCategory } from "@/types";
import { FAQ_DATA } from "@/lib/data/faq.data";

function isVisible(faq: Faq): boolean {
  return faq.isPublished;
}

/** `/faq` 전용 페이지용 — 공개된 전체 FAQ */
export async function getAllFaqs(): Promise<Faq[]> {
  return FAQ_DATA.filter(isVisible).sort((a, b) => a.order - b.order);
}

/** 홈 FAQ 섹션용 — `showOnHome`인 항목만(2026-10-17) */
export async function getHomeFaqs(): Promise<Faq[]> {
  return FAQ_DATA.filter((f) => isVisible(f) && f.showOnHome).sort((a, b) => a.order - b.order);
}

export async function getFaqsByCategory(category: FaqCategory): Promise<Faq[]> {
  return FAQ_DATA.filter((f) => isVisible(f) && f.category === category).sort(
    (a, b) => a.order - b.order,
  );
}
