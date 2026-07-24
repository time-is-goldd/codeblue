import type { ComparisonTableRow } from "@/types";

/**
 * Difference 섹션 하단 비교표(템플릿 홈페이지 제작 vs CodeBlue) 하드코딩 데이터.
 * Repository(difference.repository.ts)만 이 파일을 import한다.
 *
 * 법적 표현 원칙: 특정 업체명은 언급하지 않고 "템플릿 홈페이지 제작"이라는 일반적
 * 표현만 사용한다 — 특정 회사를 비방하거나 비교광고로 읽히지 않도록 유지한다.
 */
export const COMPARISON_TABLE_DATA: ComparisonTableRow[] = [
  {
    id: "comparison-001",
    templateValue: "착수금 또는 매월 이용료",
    codeblueValue: "100% 후불제 + 평생 소장",
    order: 0,
    isPublished: true,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-07-22T00:00:00.000Z",
  },
  {
    id: "comparison-002",
    templateValue: "통일된 템플릿",
    codeblueValue: "브랜드 맞춤 디자인",
    order: 1,
    isPublished: true,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-07-22T00:00:00.000Z",
  },
  {
    id: "comparison-003",
    templateValue: "제한된 기능 추가",
    codeblueValue: "원하는 기능 직접 구현",
    order: 2,
    isPublished: true,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-07-22T00:00:00.000Z",
  },
  {
    id: "comparison-004",
    templateValue: "서버/SEO/속도 제약",
    codeblueValue: "서버 · SEO · 속도 최적화",
    order: 3,
    isPublished: true,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-07-22T00:00:00.000Z",
  },
  {
    id: "comparison-005",
    templateValue: "디자인 중심 제작",
    codeblueValue: "고객 심리와 전환 중심 설계",
    order: 4,
    isPublished: true,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-07-22T00:00:00.000Z",
  },
];
