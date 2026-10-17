import type { GuideBlock } from "./guide";

/**
 * 제작 사례 상세(케이스 스터디, 2026-10-17) — `/portfolio/[slug]`.
 * 카드 정보(제목·이미지·기능 등)는 `Portfolio`에 있고, 여기에는 상세 페이지 본문만 둔다.
 * 본문 블록 형식은 가이드 글과 같다(`GuideBody`로 렌더링).
 */
export interface CaseStudy {
  /** 연결된 `Portfolio.slug` */
  portfolioSlug: string;
  /** 상세 페이지 첫 문단 위에 보이는 한 줄 요약 */
  summary: string;
  /** 진행 시기 표기(예: "2026년 7월") */
  period: string;
  /** 코드블루가 맡은 범위 */
  role: string;
  /** 사용한 기술·서비스 */
  stack: string[];
  blocks: GuideBlock[];
  updatedAt: string;
}
