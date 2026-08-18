import type { AssuranceChecklistItem } from "@/types";

/**
 * Difference 섹션("계약부터 결제까지, 불안하지 않도록") 4대 원칙 하드코딩 데이터.
 * Repository(difference.repository.ts)만 이 파일을 import한다.
 *
 * 섹션 개편(2026-08-19): 기존에는 사기 피해 게시글 이미지 2장 + 후불제 문구 아래에
 * 딸린 보조 체크리스트였으나, 부정적인 "사기 걱정" 프레이밍을 없애고 이 4개 원칙
 * 자체가 섹션의 핵심 콘텐츠가 되도록 재구성했다(`assurance-block.tsx` 참고). 문구도
 * 요청받은 그대로 맞췄다 — "소규모 프로젝트는 선금 없습니다" → "Launch·Business 선금
 * 0원"(Custom은 계약 시 30%라 별도 각주로 안내하므로 이 원칙은 Launch/Business로
 * 범위를 명확히 한다), "최종 검수 후 결제하세요" → "최종 검수 후 결제"(명령형 대신
 * 명사형으로 다른 3개 항목과 톤을 맞춤).
 */
export const ASSURANCE_CHECKLIST_DATA: AssuranceChecklistItem[] = [
  {
    id: "assurance-001",
    label: "Launch·Business 선금 0원",
    order: 0,
    isPublished: true,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-08-19T00:00:00.000Z",
  },
  {
    id: "assurance-004",
    label: "계약서 작성",
    order: 1,
    isPublished: true,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-08-19T00:00:00.000Z",
  },
  {
    id: "assurance-002",
    label: "중간 결제 없음",
    order: 2,
    isPublished: true,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-08-19T00:00:00.000Z",
  },
  {
    id: "assurance-003",
    label: "최종 검수 후 결제",
    order: 3,
    isPublished: true,
    createdAt: "2026-07-22T00:00:00.000Z",
    updatedAt: "2026-08-19T00:00:00.000Z",
  },
];
