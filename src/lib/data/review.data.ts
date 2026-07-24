import type { Review } from "@/types";

/**
 * Review 섹션 하드코딩 데이터 — DEVELOPMENT_PLAN.md Phase 7A(Foundation).
 * Repository(review.repository.ts)만 이 파일을 import한다.
 *
 * 실제 고객 후기(2026-07-22 교체) — 직책 정보는 제공되지 않아 `position`을 비워둔다
 * (Review 타입/ReviewCard가 이미 선택 필드로 처리해 "회사"만 표시된다).
 */
export const REVIEW_DATA: Review[] = [
  {
    id: "review-001",
    name: "박○○",
    company: "ㄷㅅ주식회사 홈페이지",
    rating: 5,
    content:
      "기업 홍보 페이지 제작을 의뢰했습니다.\n\n제작 기간 중 빠른 피드백과 요청한 기능들을 모두 완벽하게 구현해주셨고, 디자인도 깔끔하고 원하는 방향 그대로 제작해주셔서 매우 만족했습니다.",
    avatar: { alt: "박○○ 프로필 사진" },
    order: 0,
    isPublished: true,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-07-22T00:00:00.000Z",
  },
  {
    id: "review-002",
    name: "임○○",
    company: "대행 전문 홈페이지",
    rating: 5,
    content:
      "제작이 끝난 이후에도 유지보수와 추가 수정을 요청했습니다.\n\n그때마다 빠르게 피드백을 주셨고 친절하게 응대해주셨습니다.",
    avatar: { alt: "임○○ 프로필 사진" },
    order: 1,
    isPublished: true,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-07-22T00:00:00.000Z",
  },
  {
    id: "review-003",
    name: "신○○",
    company: "도어락 홈페이지",
    rating: 5,
    content:
      "후불제여서 부담 없이 홈페이지 제작을 요청할 수 있었습니다.\n\n원하는 디자인과 기능에 맞춰 제작해주셨어요.\n\n감사합니다. 다음에도 또 문의드리겠습니다 😀",
    avatar: { alt: "신○○ 프로필 사진" },
    order: 2,
    isPublished: true,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-07-22T00:00:00.000Z",
  },
];
