import "server-only";

import type { Faq, FaqCategory } from "@/types";
import { FAQ_DATA } from "@/lib/data/faq.data";

function isVisible(faq: Faq): boolean {
  return faq.isPublished;
}

export async function getAllFaqs(): Promise<Faq[]> {
  return FAQ_DATA.filter(isVisible).sort((a, b) => a.order - b.order);
}

export async function getFaqsByCategory(category: FaqCategory): Promise<Faq[]> {
  return FAQ_DATA.filter((f) => isVisible(f) && f.category === category).sort(
    (a, b) => a.order - b.order,
  );
}
