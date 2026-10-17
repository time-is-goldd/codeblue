import "server-only";

import type { Guide } from "@/types";
import { GUIDE_DATA } from "@/lib/data/guide.data";

function isVisible(guide: Guide): boolean {
  return guide.isPublished;
}

/** 최신 글이 먼저 오도록(같은 날이면 데이터 순서 유지) */
export async function getAllGuides(): Promise<Guide[]> {
  return GUIDE_DATA.filter(isVisible)
    .map((guide, index) => ({ guide, index }))
    .sort((a, b) => b.guide.publishedAt.localeCompare(a.guide.publishedAt) || a.index - b.index)
    .map(({ guide }) => guide);
}

export async function getGuideBySlug(slug: string): Promise<Guide | null> {
  return GUIDE_DATA.find((guide) => isVisible(guide) && guide.slug === slug) ?? null;
}

/** 글 끝 "함께 읽으면 좋은 글" — `related`에 적힌 순서대로, 공개된 글만 */
export async function getRelatedGuides(guide: Guide): Promise<Guide[]> {
  return guide.related
    .map((slug) => GUIDE_DATA.find((item) => item.slug === slug))
    .filter((item): item is Guide => Boolean(item && isVisible(item)));
}
