import "server-only";

import type { CaseStudy } from "@/types";
import { CASE_STUDY_DATA } from "@/lib/data/case-study.data";

export async function getCaseStudy(portfolioSlug: string): Promise<CaseStudy | null> {
  return CASE_STUDY_DATA.find((item) => item.portfolioSlug === portfolioSlug) ?? null;
}

/** 상세 페이지가 있는 포트폴리오 slug 목록 — 카드의 '자세히 보기' 링크 표시 여부에 쓴다. */
export async function getCaseStudySlugs(): Promise<string[]> {
  return CASE_STUDY_DATA.map((item) => item.portfolioSlug);
}
