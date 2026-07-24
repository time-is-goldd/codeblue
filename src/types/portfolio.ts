/**
 * DATA_SCHEMA.md 2장 기준. Supabase 이관 시 `portfolios` 테이블과 1:1 대응한다.
 */
export type PortfolioCategory =
  | "hospital"
  | "manufacturing"
  | "startup"
  | "small-business"
  | "brand";

export interface PortfolioImage {
  src: string;
  alt: string;
}

export interface PortfolioResult {
  label: string;
  value: string;
}

export interface Portfolio {
  id: string;
  slug: string;
  title: string;
  client: string;
  category: PortfolioCategory;
  thumbnail: PortfolioImage;
  gallery: PortfolioImage[];
  problem: string;
  solution: string;
  result: string;
  metrics?: PortfolioResult[];
  /** 실제 운영 중인 사이트 링크 — 있으면 카드에서 새 탭으로 바로 이동할 수 있게 한다.
   *  없으면(비공개 요청 등) 링크 없이 이미지/설명만 노출한다. */
  liveUrl?: string;
  isFeatured: boolean;
  order: number;
  isPublished: boolean;
  /** 소프트 삭제 — DATA_SCHEMA.md 1장 */
  deletedAt: string | null;
  /** admin_users.id 참조 — ARCHITECTURE.md 14장 */
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}
