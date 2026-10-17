/**
 * 홈페이지 제작 가이드 글(2026-10-17) — `/guide`, `/guide/[slug]`.
 *
 * 본문은 마크다운 대신 블록 배열로 둔다 — 의존성 없이 서버에서 그대로 렌더링하고, 제목 계층
 * (h2/h3)과 목록 구조가 HTML에 정확히 나오게 하기 위함이다. 문단·목록 안에서는
 * `[보이는 글자](/경로)` 형태로 내부 링크를 걸 수 있다(`components/guide/guide-body.tsx`).
 */
export type GuideBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  /** 강조 박스(요약·주의 사항) */
  | { type: "tip"; title: string; text: string };

export interface Guide {
  slug: string;
  title: string;
  /** 목록 카드·메타 description에 쓰는 한두 문장 요약 */
  description: string;
  /** 목록에서 묶어 보여줄 주제 이름(예: "비용·계약") */
  category: string;
  /** ISO 날짜(YYYY-MM-DD) */
  publishedAt: string;
  updatedAt: string;
  blocks: GuideBlock[];
  /** 글 끝 "함께 읽으면 좋은 글" — 다른 가이드의 slug */
  related: string[];
  isPublished: boolean;
}
