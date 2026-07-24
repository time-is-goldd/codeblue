/**
 * DATA_SCHEMA.md 4장 기준. Supabase 이관 시 `faqs` 테이블과 1:1 대응한다.
 */
export type FaqCategory =
  | "price"
  | "process"
  | "timeline"
  | "maintenance"
  | "tech"
  | "general";

export interface Faq {
  id: string;
  category: FaqCategory;
  /** 질문 제목 왼쪽에 붙는 카테고리 이모지 하나(예: "🚀"). `category`(6종, 향후
   *  필터링/분류용)와는 다른 개념 — 순수하게 질문을 한눈에 훑을 때 쓰는 시각적 표시다.
   *  2026-07-22: 오른쪽 Badge(이모지+라벨) 형태를 제거하고 이모지만 남기며 필드명도
   *  `tag`에서 `emoji`로 바꿨다(더 이상 "태그/배지"가 아니라 순수 이모지이므로). */
  emoji: string;
  question: string;
  answer: string;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
