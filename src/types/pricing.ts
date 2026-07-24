/**
 * Pricing 섹션(Portfolio-Review 사이) 데이터 — CRO 재설계(2026-07-23) 신설.
 * DEVELOPMENT_PLAN.md 원안에는 없던 섹션으로, 가격 미노출로 인한 문의 이탈을 막기 위해
 * 추가되었다. Supabase 이관 시 `pricing_tiers` / `pricing_value_proof_items` 테이블로 대응한다.
 */
export interface PricingTier {
  id: string;
  slug: "standard" | "deluxe" | "premium";
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
