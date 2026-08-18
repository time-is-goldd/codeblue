/**
 * Pricing 섹션(Portfolio-Review 사이) 데이터 — CRO 재설계(2026-07-23) 신설.
 * DEVELOPMENT_PLAN.md 원안에는 없던 섹션으로, 가격 미노출로 인한 문의 이탈을 막기 위해
 * 추가되었다. Supabase 이관 시 `pricing_tiers` / `pricing_value_proof_items` 테이블로 대응한다.
 */
export interface PricingTier {
  id: string;
  slug: "launch" | "business" | "custom";
  name: string;
  subtitle: string;
  priceLabel: string;
  pageScope: string;
  features: string[];
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

/** "왜 이렇게 저렴할까요" 근거 체크리스트 한 줄 */
export interface PricingValueProofItem {
  id: string;
  label: string;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

/** 세 플랜이 공통으로 포함하는 항목 한 줄 — 카드 안에서 반복하지 않고 Grid 아래
 *  별도 영역에서 한 번만 노출한다. */
export interface PricingCommonInclusionItem {
  id: string;
  label: string;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

/** 기본 범위를 벗어날 때 추가되는 비용 한 줄 (예: "페이지 추가: 페이지당 15~30만원") */
export interface PricingAddOnItem {
  id: string;
  label: string;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
