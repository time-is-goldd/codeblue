/**
 * DATA_SCHEMA.md 7장 기준. Supabase 이관 시 `cta_items` 테이블과 1:1 대응한다.
 * 동일 slot에 대해 isActive=true인 레코드는 항상 하나만 존재해야 한다.
 */
export type CtaSlot =
  | "header-cta"
  | "hero-primary"
  | "hero-secondary"
  | "floating-cta"
  | "portfolio-page-bottom"
  | "contact-section";

export interface Cta {
  id: string;
  slot: CtaSlot;
  title?: string;
  description?: string;
  buttonLabel: string;
  buttonHref: string;
  isActive: boolean;
  updatedAt: string;
}
