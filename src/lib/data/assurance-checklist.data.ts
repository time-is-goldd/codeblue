import type { AssuranceChecklistItem } from "@/types";

/**
 * Difference 섹션 Block 1("100% 후불제") 체크리스트 하드코딩 데이터.
 * Repository(difference.repository.ts)만 이 파일을 import한다.
 */
export const ASSURANCE_CHECKLIST_DATA: AssuranceChecklistItem[] = [
  {
    id: "assurance-001",
    label: "선금 없습니다",
    order: 0,
    isPublished: true,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-07-22T00:00:00.000Z",
  },
  {
    id: "assurance-002",
    label: "중간 결제 없습니다",
    order: 1,
    isPublished: true,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-07-22T00:00:00.000Z",
  },
  {
    id: "assurance-003",
    label: "결과에 만족하실 때만 결제하세요",
    order: 2,
    isPublished: true,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-07-22T00:00:00.000Z",
  },
  {
    id: "assurance-004",
    label: "고객님의 리스크를 0%로 만들어드립니다",
    order: 3,
    isPublished: true,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-07-22T00:00:00.000Z",
  },
];
