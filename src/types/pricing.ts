/**
 * Pricing 섹션(Portfolio-Review 사이) 데이터 — CRO 재설계(2026-07-23) 신설.
 * DEVELOPMENT_PLAN.md 원안에는 없던 섹션으로, 가격 미노출로 인한 문의 이탈을 막기 위해
 * 추가되었다. Supabase 이관 시 `pricing_tiers` 테이블로 대응한다.
 *
 * `PricingValueProofItem`("왜 이렇게 저렴할까요" 근거 카드)은 홈페이지 길이 정리
 * (2026-08-19)로 해당 카드 자체를 섹션에서 없애며 함께 제거했다 — Repository/데이터/
 * 컴포넌트(`pricing-value-proof.tsx`)도 함께 삭제됐다.
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

/** 기본 범위를 벗어날 때 추가되는 비용 한 줄 (예: "페이지 추가: 페이지당 15~30만원") */
export interface PricingAddOnItem {
  id: string;
  label: string;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
