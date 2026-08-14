/**
 * Difference 섹션("왜 코드블루를 선택해야 하는가") 데이터 — 후불제 안심 체크리스트(Block 1) +
 * 템플릿 대비 비교표. Supabase 이관 시 `assurance_checklist_items` / `comparison_table_rows`
 * 테이블과 1:1 대응한다 (DATA_SCHEMA.md 참조).
 */

/** Block 1("100% 후불제") 하단 체크리스트 한 줄 (예: "선금 없습니다") */
export interface AssuranceChecklistItem {
  id: string;
  label: string;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

/** 비교표 한 행 — 왼쪽(템플릿 홈페이지 제작)과 오른쪽(CodeBlue)이 서로 대응하는 문구 쌍 */
export interface ComparisonTableRow {
  id: string;
  templateValue: string;
  codeblueValue: string;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
