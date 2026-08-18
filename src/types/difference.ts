/**
 * Difference 섹션("왜 코드블루를 선택해야 하는가") 데이터 — 후불제 안심 체크리스트(Block 1).
 * Supabase 이관 시 `assurance_checklist_items` 테이블과 1:1 대응한다 (DATA_SCHEMA.md 참조).
 */

/** Block 1(후불제 안심 메시지) 하단 체크리스트 한 줄 (예: "소규모 프로젝트는 선금 없습니다") */
export interface AssuranceChecklistItem {
  id: string;
  label: string;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
