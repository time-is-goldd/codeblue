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
  /** 프로젝트 구분 — 실제 제작물은 "기업 홈페이지 제작" 등 실제 범위를, 실제 고객사가
   *  아닌 기획 샘플은 "업종별 샘플 시안"처럼 카드에서 배지로도 그대로 노출된다. */
  projectType: string;
  /** 제작 목적 한 줄 */
  purpose: string;
  /** 제작 범위 한 줄 (예: "약 10페이지") */
  scope: string;
  /** 주요 기능 목록 — 실제로 구현된 범위만 나열한다 */
  features: string[];
  metrics?: PortfolioResult[];
  /** 실제 운영 중인 사이트 링크 — 있으면 카드에서 새 탭으로 바로 이동할 수 있게 한다.
   *  없으면(비공개 요청 등) 링크 없이 이미지/설명만 노출한다. */
  liveUrl?: string;
  /** true면 실제 고객사 프로젝트가 아닌 CodeBlue 자체 기획 샘플 — 카드/상세 화면에
   *  "업종별 샘플 시안" 배지와 구분 문구를 강제로 노출해 실제 사례와 혼동되지 않게 한다. */
  isSample: boolean;
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
