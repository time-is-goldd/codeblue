import type { AssuranceChecklistItem } from "@/types";

/**
 * Difference 섹션 Block 1("100% 후불제") 체크리스트 하드코딩 데이터.
 * Repository(difference.repository.ts)만 이 파일을 import한다.
 */
export const ASSURANCE_CHECKLIST_DATA: AssuranceChecklistItem[] = [
  {
    id: "assurance-001",
    label: "소규모 프로젝트는 선금 없습니다",
    order: 0,
    isPublished: true,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-08-15T00:00:00.000Z",
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
    label: "최종 검수 후 결제하세요",
    order: 2,
    isPublished: true,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-08-15T00:00:00.000Z",
  },
  {
    id: "assurance-004",
    label: "계약서를 작성하고 진행합니다",
    order: 3,
    isPublished: true,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-08-15T00:00:00.000Z",
  },
];
